//Required library dependencies for browserify
const verify_tlsn = require('./lib/tlsn-verify.js');
const verify_comp = require('./lib/computation-verify.js');
//fs is only used for this example and can be omitted
//depending on the method that the proof's content is fetched
const fs = require('fs');

/*
Fetch contents of proofs
Can be done in various ways for production
The following usage is for example only, as the contents
are basically entered this way as static strings
*/
var tlsnv1 = fs.readFileSync('./proof/tlsnv1.proof');
var tlsnv2 = fs.readFileSync('./proof/tlsnv2.proof');
var computationProofContent = fs.readFileSync('./proof/computation.proof');

//after fetching and before sending for verification
//convert content to Uint8Array
var v1 = verifyProof(new Uint8Array(tlsnv1));
var v2 = verifyProof(new Uint8Array(tlsnv2));
var computationProof = verifyProof(new Uint8Array(computationProofContent));

console.log(computationProof.subproof);

console.log('normal proof v1 passed verification=' + v1.result);
subproofChecker(v1.subproof);
console.log('normal proof v2 passed verification=' + v2.result);
subproofChecker(v2.subproof);
console.log('computation proof passed verification=' + computationProof.result);
subproofChecker(computationProof.subproof);

/*
Edit as needed, but should follow try catch format

data parameter must be a Uint8Array type of the
proof's content

Returns an object with labels 'result' and 'subproof'
'subproof' will specify whether a subproof was present
such as a computation proof within a tlsn. Will be false,
if it does not contain a subproof
*/
function verifyProof(data) {
	const type = getProofType(data);
	var subproof = false;
	//acts as divider
	console.log('');
	consoleDivider();

	switch (type) {
	case ('tlsn'):
		try {
			console.log('Verifying TLSNotary proof...')
			const verificationResult = verify_tlsn.verify(data);
			console.log('TLSNotary proof successfully verified!');

			const decryptedHtml = verificationResult[0];

			if (isComputationProof(decryptedHtml)) {
				subproof = 'computation';
				console.log('Computation proof found...');

				verify_comp.verifyComputation(decryptedHtml);
				console.log('Computation verified!');
			}

			//verification passed without issues
			return { result: true, subproof: subproof };
		} catch (e) {
			console.log(e);

			//indicates verification failed
			return { result: false, subproof: false };
		} finally {
			consoleDivider();
		}
	default:
		console.log('Unknown proof type');
		consoleDivider();
		return { result: false, subproof: false };
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
		var proofHeader = (typeof proof === 'object') ? ba2str(proof.slice(0, proofSlice[i].slice)) : proof.slice(0, proofSlice[i].slice);
		if (proofHeader === proofSlice[i].content) {
			return proofSlice[i].proofName;
		}
	}
}

function consoleDivider() {
	console.log('##############################################');
}

function subproofChecker(subproof) {
	if (subproof !== false)
		console.log('also contained a ' + subproof + ' proof');
}
