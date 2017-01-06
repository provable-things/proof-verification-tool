// this verification uses portions from the pagesigner
// whose code is slightly modified but mostly kept intact
// for potential web re-use

const fs = require('fs');
const vm = require('vm');
const sha256 = require('sha256');
const BigInteger = require('big-integer');
const oracle = require('./oraclize/oracles.js');

loadDependencies();

// Verify TLSNotary and check if is valid
var exports = module.exports = {};

exports.verify = data => {
	data = ua2ba(data);
	var offset = 0;
	var header = ba2str(data.slice(offset, offset += 29));
	if (header !== 'tlsnotary notarization file\n\n') {
		throw new Error('wrong header');
	}
	// Currently supports v1 and v2
	var version = ba2int(data.slice(offset, offset += 2));

	if (isNaN(version) || version === 0 || version > 2) {
		throw new Error('wrong version');
	}

	var cs = ba2int(data.slice(offset, offset += 2));
	var cr = data.slice(offset, offset += 32);
	var sr = data.slice(offset, offset += 32);
	var pms1 = data.slice(offset, offset += 24);
	var pms2 = data.slice(offset, offset += 24);
	var chain_serialized_len = ba2int(data.slice(offset, offset += 3));
	var chain_serialized = data.slice(offset, offset += chain_serialized_len);
	var tlsver = data.slice(offset, offset += 2);
	var tlsver_initial = data.slice(offset, offset += 2);
	var response_len = ba2int(data.slice(offset, offset += 8));
	var response = data.slice(offset, offset += response_len);
	var IV_len = ba2int(data.slice(offset, offset += 2));
	var IV = data.slice(offset, offset += IV_len);
	var sig_len = ba2int(data.slice(offset, offset += 2));
	var sig = data.slice(offset, offset += sig_len);
	var commit_hash = data.slice(offset, offset += 32);
	var notary_pubkey = data.slice(offset, offset += sig_len);

	// v2 support for time
	if (version === 2) {
		var time = data.slice(offset, offset += 4)
	}
	// start verification
	try {
		assert(data.length === offset, 'invalid .pgsg length');
		offset = 0;
		var chain = []; // For now we only use the 1st cert in the chain
		while (offset < chain_serialized.length) {
			var len = ba2int(chain_serialized.slice(offset, offset += 3));
			var cert = chain_serialized.slice(offset, offset += len);
			chain.push(cert);
		}

		var commonName = getCommonName(chain[0]);

		// verify cert
		// not throwing but only logging if verbose mode is on
		// due to self-signed certs that may fail here, which
		// shouldn't invalidate the verification
		if (!verifyCert(chain)) {
			console.log('certificate verification failed');
		}
		var modulus = getModulus(chain[0]);

		// Verify commit hash
		if (sha256(response).toString() !== new Buffer(commit_hash).toString('hex')) {
			throw new Error('commit hash mismatch');
		}
		var signed_data;
		// Verify sig
		if (version >= 2) {
			signed_data = sha256([].concat(commit_hash, pms2, modulus, time));
		} else {
			signed_data = sha256([].concat(commit_hash, pms2, modulus));
		}

		var signingKey;
		var mainPubKey = '';
		var commitHashVerified = false;
		var servers = oracle.servers[version];
		for (var i = 0; i < servers.length; i++) {
			var server = servers[i];
			try {
				switch (version) {
					case 1:
						oracle.validateServer(server, 'main', mainPubKey);
						// resultSig = oracle.validateServer(server.sig, 'sig', mainPubKey);
						// result = resultMain && resultSig;
						break;
					default:
						oracle.validateServer(server, '', mainPubKey);
				}
			} catch (err) {
				if (err.name === 'aws_request_failed' && version === 1) {
					console.log('TLSNotary Type 1, server may be offline');
				} else {
					throw new Error(err.message);
				}
			}
			signingKey = server.sig.modulus;
			if (verifyCommitHashSignature(signed_data, sig, signingKey)) {
				commitHashVerified = true;
				break
			}
		}

		if (!commitHashVerified) {
			throw new Error('Matching notary server not found')
		}

		//Disable console log, needless verbose output from TLSNClientSession
		var saveConsole = console.log;

		console.log = function () {};

		//decrypt html and check MAC
		var s = new TLSNClientSession();
		s.__init__();
		s.unexpected_server_app_data_count = response.slice(0, 1);
		s.chosen_cipher_suite = cs;
		s.client_random = cr;
		s.server_random = sr;
		s.auditee_secret = pms1.slice(2, 2 + s.n_auditee_entropy);
		s.initial_tlsver = tlsver_initial;
		s.tlsver = tlsver;
		s.server_modulus = modulus;
		s.set_auditee_secret();
		s.auditor_secret = pms2.slice(0, s.n_auditor_entropy);
		s.set_auditor_secret();
		s.set_master_secret_half(); //#without arguments sets the whole MS
		s.do_key_expansion(); //#also resets encryption connection state
		s.store_server_app_data_records(response.slice(1));
		s.IV_after_finished = IV;
		s.server_connection_state.seq_no += 1;
		s.server_connection_state.IV = s.IV_after_finished;
		var html_with_headers = decrypt_html(s);

		//re-enable console logging
		console.log = saveConsole;
		return [html_with_headers, commonName, data, notary_pubkey];
	} catch (err) {
		if (typeof saveConsole !== 'undefined')
			console.log = saveConsole;

		throw ('TLSNotary Verification Error: ' + err + ` ` + err.stack);
	}
}

function verifyCommitHashSignature(commithash, signature, modulus) {
	//RSA verification is sig^e mod n, drop the padding and get the last 32 bytes
	var bigint_signature = new BigInteger(ba2hex(signature), 16);
	var bigint_mod = new BigInteger(ba2hex(modulus), 16);
	var bigint_exp = new BigInteger(ba2hex(bi2ba(65537)), 16);
	var bigint_result = bigint_signature.modPow(bigint_exp, bigint_mod);
	var padded_hash = hex2ba(bigint_result.toString(16));
	var hash = padded_hash.slice(padded_hash.length - 32);
	if (commithash.toString() === new Buffer(hash).toString('hex')) {
		return true;
	}
	return false;
}

function getModulus(cert) {
	var c = Certificate.decode(new Buffer(cert), 'der');
	var pk = c.tbsCertificate.subjectPublicKeyInfo.subjectPublicKey.data;
	var pkba = ua2ba(pk);
	// Expected modulus length 256, 384, 512
	var modlen = 256;
	if (pkba.length > 384) modlen = 384;
	if (pkba.length > 512) modlen = 512;
	var modulus = pkba.slice(pkba.length - modlen - 5, pkba.length - 5);
	return modulus;
}

function getCommonName(cert) {
	var c = Certificate.decode(new Buffer(cert), 'der');
	var fields = c.tbsCertificate.subject.value;
	for (var i = 0; i < fields.length; i++) {
		if (fields[i][0].type.toString() !== [2, 5, 4, 3].toString()) continue;
		//first 2 bytes are DER-like metadata
		return ba2str(fields[i][0].value.slice(2));
	}
	return 'unknown';
}

function verifyCert(chain) {
	var chainperms = permutator(chain);
	for (var i = 0; i < chainperms.length; i++) {
		if (verifyCertChain(chainperms[i])) {
			return true;
		}
	}
	return false;
}

function permutator(inputArr) {
	var results = [];

	function permute(arr, memo) {
		var cur, memo = memo || [];

		for (var i = 0; i < arr.length; i++) {
			cur = arr.splice(i, 1);
			if (arr.length === 0) {
				results.push(memo.concat(cur));
			}
			permute(arr.slice(), memo.concat(cur));
			arr.splice(i, 0, cur[0]);
		}

		return results;
	}

	return permute(inputArr);
}

function loadDependencies() {
	console.log('Loading TLSNotary dependencies...');

	//For getting original TLSN js scripts to work
	//Rather than making custom files and requiring additional user trust
	global.CryptoJS = require('crypto-js');
	global.KJUR = require('jsrsasign');

	var tlsnCertList = fs.readFileSync('./lib/tlsn/verifychain/rootcertslist.js');
	var tlsnRootCerts = fs.readFileSync('./lib/tlsn/verifychain/rootcerts.js');
	var tlsnVerifyChain = fs.readFileSync('./lib/tlsn/verifychain/verifychain.js');
	var tlsnClientFile = fs.readFileSync('./lib/tlsn/tlsn.js');

	if (typeof navigator === 'undefined') {
		//enables require on V8 VM
		global.require = require;

		vm.runInThisContext(tlsnCertList);
		vm.runInThisContext(tlsnRootCerts);
		vm.runInThisContext(tlsnVerifyChain);

		global.require = null;

		//Remove browser-requirement if not browser
		//emulating chrome
		global.navigator = {};
		global.navigator.userAgent = 'chrome';
		//alternative
		//tlsnClientFile = tlsnClientFile.replace(/navigator.userAgent.toLowerCase\(\).indexOf\(\'chrome\'\) \> -1;/, 'true')
		vm.runInThisContext(tlsnClientFile);

		//unload
		global.navigator = undefined;
	} else {

		if (typeof window === 'undefined' && typeof self !== 'undefined')
			window = self;

		try {
			var tlsnUtilsFile = fs.readFileSync('./lib/tlsn/tlsn_utils.js');
			this.eval(String(tlsnUtilsFile));
			this.eval(String(tlsnCertList));
			this.eval(String(tlsnRootCerts));
			this.asn1 = require('asn1.js');
			this.Buffer = require('buffer').Buffer;
			tlsnVerifyChain = String(tlsnVerifyChain);
			var index = tlsnVerifyChain.indexOf('var origcerts');
			this.eval(tlsnVerifyChain.substr(index));
			this.eval(String(tlsnClientFile));
		} catch (err) {
			throw ('Failed to load dependencies: ' + e + ' | Stack: ' + e.stack);
		}
	}
}
