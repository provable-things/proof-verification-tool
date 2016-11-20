//Required library dependencies for browserify
const verify_tlsn = require('./lib/tlsnVerify.js');
const verify_comp = require('./lib/computationVerify.js');
//fs is only used for this example and can be omitted
//depending on the method that the proof's content is fetched
const fs = require('fs');

/*
Fetch contents of proofs
Can be done in various ways for production
The following usage is for example only, as the contents
are basically entered this way as static strings
*/
var normalProofContent = fs.readFileSync('./proof/QmNpJ7ytEiYjX1Tf9h5ikG9kuVt2KdjEQRg31Z9sakDHd5');
var corruptProofContent = fs.readFileSync('./proof/QmNpcorrupted');
var computationProofContent = fs.readFileSync('./proof/QmPWgqzdzLW5LjgrjyPi2JUUzSsqaYze3LHFGGTA7UYWFH');

//after fetching and before sending for verification
//convert content to Uint8Array
var normalProof = verifyProof(new Uint8Array(normalProofContent));
var corruptProof = verifyProof(new Uint8Array(corruptProofContent));
var computationProof = verifyProof(new Uint8Array(computationProofContent));

console.log('normal proof passed verification=' + normalProof);
console.log('corrupt proof passed verification=' + corruptProof);
console.log('computation proof passed verification=' + computationProof);

//Edit as needed, but should follow try catch format
//and return true or false
function verifyProof(data) {
	const type = getProofType(data);
	consoleDivider();
	switch (type) {
	case ('tlsn'):
		try {
			console.log('Verifying TLSNotary proof...')
			const verificationResult = verify_tlsn.verify(data);
			console.log('TLSNotary proof successfully verified!');

			const decryptedHtml = verificationResult[0];

			if (isComputationProof(decryptedHtml)) {
				console.log('Computation proof found...');

				verify_comp.verifyComputation(decryptedHtml);
				console.log('Computation verified!');
			}
			consoleDivider();

			//verification passed without issues
			return true;
		} catch (e) {
			console.log(e);
			consoleDivider();

			//indicates verification failed
			return false;
		} finally {
			consoleDivider();
		}
	default:
		console.log('Unknown proof type');
		consoleDivider();
		return false
	}
}

function isComputationProof(html) {
	const compCheck1 = '</GetConsoleOutputResponse>';
	//Ensure GetConsoleOutputResponse is last element
	const validator1 = html.indexOf(compCheck1) + compCheck1.length - html.length;

	const compCheck2 = 'Server: AmazonEC2';
	const validator2 = html.indexOf(compCheck2);

	return (validator1 === 0 && validator2 !== -1);
}

function getProofType(proof) {
	const proofSlice = [
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
		const proofHeader = (typeof proof === 'object') ? ba2str(proof.slice(0, proofSlice[i].slice)) : proof.slice(0, proofSlice[i].slice);
		if (proofHeader === proofSlice[i].content) {
			return proofSlice[i].proofName;
		}
	}
}

function consoleDivider() {
	console.log('##############################################');
}
