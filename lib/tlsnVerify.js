const fs = require('fs'),
	vm = require('vm'),
	sha256 = require('sha256'),
	BigInteger = require('big-integer'),
	oracles = require('./oraclize/oracles.js');

loadDependencies();

// Verify TLSNotary and check if is valid
module.exports = {
	//include ms counter of time it took to verify???
	verify: function (data, from_past) {
		var data = ua2ba(data);
		var offset = 0;
		var header = ba2str(data.slice(offset, offset += 29));
		if (header !== "tlsnotary notarization file\n\n") {
			throw ('wrong header');
		}
		if (data.slice(offset, offset += 2).toString() !== [0x00, 0x01].toString()) {
			throw ('wrong version');
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
		assert(data.length === offset, 'invalid .pgsg length');

		offset = 0;
		var chain = []; //For now we only use the 1st cert in the chain
		while (offset < chain_serialized.length) {
			var len = ba2int(chain_serialized.slice(offset, offset += 3));
			var cert = chain_serialized.slice(offset, offset += len);
			chain.push(cert);
		}
		//return (chain[0].length)

		var commonName = getCommonName(chain[0]);

		//verify cert
		if (!verifyCert(chain)) {
			//disable throw in case of self-signed or non-accepted certs
			//throw ('certificate verification failed');
			console.log('certificate verification failed');
		}


		var modulus = getModulus(chain[0]);
		//return (new Buffer(commit_hash).toString('hex') + '\n' + sha256(response).toString());
		//verify commit hash
		if (sha256(response).toString() !== new Buffer(commit_hash).toString('hex')) {
			throw ('commit hash mismatch');
		}

		//verify sig
		var signed_data = sha256([].concat(commit_hash, pms2, modulus));
		var signing_key;

		var chosen_notary = oracles[Math.random() * (oracles.length) << 0];
		if (from_past) { signing_key = notary_pubkey; } else { signing_key = chosen_notary.sig.modulus; }
		if (!verify_commithash_signature(signed_data, sig, signing_key)) {
			throw ('notary signature verification failed');
		}

		//Disable console log, needless verbose output from TLSNClientSession
		var saveConsole = console.log;

		console.log = function () {};
		try {
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
			html_with_headers = decrypt_html(s);

			//re-enable console logging
			console.log = saveConsole;
			return [html_with_headers, commonName, data, notary_pubkey];
		} catch (e) {
			console.log = saveConsole;
			throw ('TLSNotary verification error: ' + e);
		}
	}
};

function verify_commithash_signature(commithash, signature, modulus) {
	//RSA verification is sig^e mod n, drop the padding and get the last 32 bytes
	var bigint_signature = new BigInteger(ba2hex(signature), 16);
	var bigint_mod = new BigInteger(ba2hex(modulus), 16);
	var bigint_exp = new BigInteger(ba2hex(bi2ba(65537)), 16);
	var bigint_result = bigint_signature.modPow(bigint_exp, bigint_mod);
	var padded_hash = hex2ba(bigint_result.toString(16));
	var hash = padded_hash.slice(padded_hash.length - 32);

	if (commithash.toString() === new Buffer(hash).toString('hex')) {
		return true;
	} else {
		return false;
	}
}

function getModulus(cert) {
	var c = Certificate.decode(new Buffer(cert), 'der');
	var pk = c.tbsCertificate.subjectPublicKeyInfo.subjectPublicKey.data;
	var pkba = ua2ba(pk);
	//expected modulus length 256, 384, 512
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
	GLOBAL.CryptoJS = require('crypto-js');
	GLOBAL.atob = require('atob');
	GLOBAL.btoa = require('btoa');
	GLOBAL.KJUR = require('jsrsasign');

	//enables require on V8 VM
	GLOBAL.require = require;

	vm.runInThisContext(fs.readFileSync('./lib/tlsn/verifychain/rootcertslist.js'));
	vm.runInThisContext(fs.readFileSync('./lib/tlsn/verifychain/rootcerts.js'));
	vm.runInThisContext(fs.readFileSync('./lib/tlsn/verifychain/verifychain.js'));

	GLOBAL.require = null;

	var tlsnClientFile = String(fs.readFileSync('./lib/tlsn/tlsn.js'));

	//Remove browser-requirement
	tlsnClientFile = tlsnClientFile.replace(/navigator.userAgent.toLowerCase\(\).indexOf\(\'chrome\'\) \> -1;/g, 'true')
	vm.runInThisContext(tlsnClientFile);

}
