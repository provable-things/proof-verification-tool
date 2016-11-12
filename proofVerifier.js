require('./lib/loadUtils.js');
const https = require('https'),
	fs = require('fs');

//load dependencies on-demand only
var tlsn,
	comp;

//fetches any files in proof folder and verifies them
function autoVerify() {
	var proofs = fs.readdirSync('./proof/');
	//console.log(proofs);
	for (var i = 0; i < proofs.length; i++)
		parseProofFile('./proof/' + proofs[i]);
}

function parseProofFile(proofFile) {
	var parsedProof = new Uint8Array(fs.readFileSync(proofFile));
	verifyProof(parsedProof, proofFile);
}

function verifyProof(data, file) {
	type = getProofType(data);
	switch (type) {
	case ('tlsn'):
		try {
			if (typeof (tlsn) === 'undefined')
				tlsn = require('./lib/tlsnVerify.js');

			console.log('\n##############################################\n' + file.substr(file.lastIndexOf('/') + 1));
			console.log('Verifying TLSNotary proof...')
			var verificationResult = tlsn.verify(data);
			console.log('TLSNotary proof successfully verified!');
			var decryptedHtml = verificationResult[0];
			//console.log(decryptedHtml);
			if (isComputationProof(decryptedHtml)) {
				if (typeof (comp) === 'undefined')
					comp = require('./lib/computationVerify.js');
				console.log('Computation proof found...');

				//second arg should take archive.zip
				comp.verifyComputation(decryptedHtml, '');
				console.log('Computation verified!');
			}
		} catch (e) {
			console.log(e);
			return;
		}
		break; //placeholder
		/*case ('android'):
			try {
				data = (typeof (data) == 'object') ? strFromUtf8Ab(data) : data;
				verifyProofandroid(data, extra[3], extra[4], extra[0], extra[1], extra[2]);
			} catch (e) {
				console.log('Verification error ', e);
				extra[0][extra[1]].tx_count_1b = false;
				extra[0][extra[1]].tx_count_1a = false;
				extra[0][extra[1]].tx_count_1c = true;
				postMessage({ type: 'textUpdate', value: ['android', false] });
				postMessage({ type: 'chartUpdate', value: extra[0] });
				checkProof(extra[2] + 1);
				return;
			}
			break;*/
	default:
		console.log('Unknown proof type');
		break;
	}
	console.log('##############################################');
}


function isComputationProof(html) {
	var compCheck1 = '</GetConsoleOutputResponse>';
	//Ensure GetConsoleOutputResponse is last element
	var validator1 = html.indexOf(compCheck1) + compCheck1.length - html.length;

	var compCheck2 = 'Server: AmazonEC2';
	var validator2 = html.indexOf(compCheck2);

	return (validator1 === 0 && validator2 !== -1);
}

function getProofType(proof) {
	var proofSlice = [
		{
			"slice": 27,
			"content": "tlsnotary notarization file",
			"proofName": "tlsn"
		},
		{
			"slice": 3,
			"content": "S01",
			"proofName": "android"
		}
	];

	for (var i = 0; i < proofSlice.length; i++) {
		var proofHeader = (typeof (proof) === 'object') ? ba2str(proof.slice(0, proofSlice[i].slice)) : proof.slice(0, proofSlice[i].slice);
		if (proofHeader === proofSlice[i].content) {
			return proofSlice[i].proofName;
		}
	}
}

autoVerify();
//read_tls_proof('QmNpJ7ytEiYjX1Tf9h5ikG9kuVt2KdjEQRg31Z9sakDHd5');
//parseProofFile('QmPWgqzdzLW5LjgrjyPi2JUUzSsqaYze3LHFGGTA7UYWFH');
//get_ipfs_proof('https://ipfs.infura.io/ipfs/', 'QmNpJ7ytEiYjX1Tf9h5ikG9kuVt2KdjEQRg31Z9sakDHd5')
