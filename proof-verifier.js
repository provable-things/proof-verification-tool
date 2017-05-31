var utils = require('./lib/load-utils.js');
const oracle = require('./lib/oraclize/oracles.js');
var fs = require('fs');

checkVersion();
// load these dependencies on-demand only
var tlsn;
var computation;
var android;
var verifiedServers = [];

function checkVersion() {
	if (process.version.substr(1, 1) === '0') {
		console.log('Not compatible with ' + process.version + ' of nodeJS, please use at least v4.x.x');
		console.log('exiting');
		process.exit(1);
	}
}

// Feches any files in proof folder and verifies them
function autoVerify() {
	const proofs = fs.readdirSync('./proof/');
	console.log('Verify TLSNotary servers validity');
	verifiedServers = getVerifiedServers();
	console.log('TLSNotary servers validity caching ended');

	if (proofs.length === 0) {
		console.log('No files found in proof folder...');
		process.exit(1);
	}

	for (var h = 0; h < proofs.length; h++) {
		var path = './proof/' + proofs[h];
		if (!fs.lstatSync(path).isDirectory()) {
			parseProofFile(path);
		}
	}
}

function parseProofFile(proofFile) {
	const parsedProof = new Uint8Array(fs.readFileSync(proofFile));
	verifyProof(parsedProof, proofFile);
}


function getVerifiedServers() {
	var mainPubKey;
	var vServers = [];

	for (var j = 1; j < 3; j++) {
		var servers = oracle.servers[j];
		for (var i = 0; i < servers.length; i++) {
			var server = servers[i];
			try {
				switch (j) {
					case 1:
						mainPubKey = oracle.validateServer(server, 'main', mainPubKey);
						oracle.validateServer(server, 'sig', mainPubKey);
						break;
					default:
						mainPubKey = oracle.validateServer(server, '', mainPubKey);
				}
				console.log('Valid server:' + server.name);
			} catch (err) {
				if (err.name === 'aws_request_failed' && j === 1) {
					console.log('"Pagesigner notary server v1, verification status is unknown: the server might be offline or non-existent anymore');
				} else {
					console.log(server.name + ': skipping invalid server');
				}
			}
			vServers.push(server);
		}
	}
	return vServers;
}

function verifyProof(data, file) {
	const type = getProofType(data);
	console.log('\n##############################################\n' + parseFileName(file));

	switch (type) {
		case 'tlsn':
			try {
				if (typeof tlsn === 'undefined') {
					tlsn = require('./lib/tlsn-verify.js');
				}

				console.log('Verifying TLSNotary proof...');

				const verificationResult = tlsn.verify(data, verifiedServers);
				console.log('TLSNotary proof successfully verified!');

				const decryptedHtml = verificationResult[0];
				
				var dir = './output';

				if (!fs.existsSync(dir)) {
					fs.mkdirSync(dir);
				}

				var flagPosition;
				process.argv.forEach( function(val, index, array) {
					if (val == "--saveContent") {
						flagPosition = index;
					}
				});
				
				var flagString = String(process.argv[flagPosition]);	
				flagString = flagString.toLowerCase().trim();
				
				if (flagString == "--savecontent") {
					var appRoot = process.cwd();
					fs.writeFile(appRoot + "/output/" + parseFileName(file) + ".out", decryptedHtml, function(err) {
						if(err) {
							console.log("error", err);
						}
						else {
							console.log("Writing proof content to file...")
						}

					});
				}

				if (isComputationProof(decryptedHtml)) {
					if (typeof computation === 'undefined') {
						computation = require('./lib/computation-verify.js');
					}

					console.log('Computation proof found...');
					computation.verifyComputation(decryptedHtml);
					console.log('Computation verified!');
				}
			} catch (err) {
				console.log(err);
			}
			break;
		case 'android':
			try {
				if (typeof android === 'undefined') {
					android = require('./lib/android-verify.js');
				}

				// Loading and parsing certificate chain of signing key
				console.log('Fetch AndroidProof.chain from ./certs');
				var chain = android.getCertificateChain();
				var params = android.getVerificationParameters();

				if (android.verify(data, chain, params)) {
					console.log('The Android Proof contained in ' + parseFileName(file) + 'is valid');
				}
			} catch (err) {
				console.log('The Android Proof contained in ' + parseFileName(file) + 'is invalid');
				console.log(err.stack);
			}
			break;
		case 'ledger':
			try {
				if (typeof ledger === 'undefined') {
					ledger = require('./lib/ledger-verify.js');
				}
			
				const result = ledger.verify(data);
				if(result[1]) {
					switch(result[0]) {
						case 'random':
							
							const result = ledger.verifyRandom(data);
							if (result) {
								console.log('The Ledger Proof and the Random Proof contained in ' + parseFileName(file) + ' are valid');
							} else {
								console.log('The Ledger Proof contained in ' + parseFileName(file) + ' is valid, but the Random Proof is invalid');
							}
							break;
						default:
							console.log('The Ledger Proof contained in ' + parseFileName(file) + ' is valid, but the nested proof is not recognized');
					}
				} else {
					console.log('The Ledger Proof contained in ' + parseFileName(file) + ' is invalid');
				}

			} catch (err) {
				console.log('The Ledger Proof contained in ' + parseFileName(file) + ' is valid, but the subproof failed with error:' + err);
			}
			break;
		default:
			console.log(parseFileName(file));
			console.log('Unknown proof type');
	}
	console.log('##############################################');
}

function isComputationProof(html) {
	const compCheck1 = '</GetConsoleOutputResponse>';
	// Ensure GetConsoleOutputResponse is last element
	const validator1 = html.indexOf(compCheck1) + compCheck1.length - html.length;

	const compCheck2 = 'Server: AmazonEC2';
	const validator2 = html.indexOf(compCheck2);

	return (validator1 === 0 && validator2 !== -1);
}

function getProofType(proof) {
	const proofSlice = [
		{
			slice: 27,
			content: 'tlsnotary notarization file',
			proofName: 'tlsn'
		},
		{
			slice: 3,
			content: 'AP\x01',
			proofName: 'android'
		},
		{
			slice: 3,
			content: 'LP\x01',
			proofName: 'ledger'
		}
	];

	for (var i = 0; i < proofSlice.length; i++) {
		var proofHeader = (typeof proof === 'object') ? ba2str(proof.slice(0, proofSlice[i].slice)) : proof.slice(0, proofSlice[i].slice);
		if (proofHeader === proofSlice[i].content) {
			return proofSlice[i].proofName;
		}
	}
}

function parseFileName(file) {
	return file.substr(file.lastIndexOf('/') + 1);
}

autoVerify();
