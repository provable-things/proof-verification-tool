//Required library dependencies for browserify
const verify_tlsn = require('./lib/tlsnVerify.js');
const verify_comp = require('./lib/computationVerify.js');

/*
Edit as needed, but should follow try catch format
and return true or false. Less verbose than the
test and standalone verifier

data parameter must be a Uint8Array type of the
proof's content
*/
verifyProof = function (data) {
	const type = getProofType(data);
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

			//verification passed without issues
			return true;
		} catch (e) {
			console.log(e);

			//indicates verification failed
			return false;
		}
	default:
		console.log('Unknown proof type');
		return false;
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

getProofType = function (proof) {
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
