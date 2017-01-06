var utils = require('./lib/load-utils.js');
checkVersion();
// load these dependencies on-demand only
var tlsn;
var computation;
var android;

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

	if (proofs.length === 0) {
		console.log('No files found in proof folder...');
		process.exit(1);
	}

	for (var i = 0; i < proofs.length; i++) {
		var path = './proof/' + proofs[i];
		if (!fs.lstatSync(path).isDirectory()) {
			parseProofFile(path);
		}
	}
}

function parseProofFile(proofFile) {
	const parsedProof = new Uint8Array(fs.readFileSync(proofFile));
	verifyProof(parsedProof, proofFile);
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

				const verificationResult = tlsn.verify(data);
				console.log('TLSNotary proof successfully verified!');

				const decryptedHtml = verificationResult[0];

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
