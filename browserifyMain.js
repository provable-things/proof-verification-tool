//Required library dependencies for browserify
const verify_tlsn = require('./lib/tlsnVerify.js');
const verify_comp = require('./lib/computationVerify.js');
const android = require('./lib/androidVerify.js')
/*
Edit as needed, but should follow try catch format

data parameter must be a Uint8Array type of the
proof's content

Returns an object with labels 'result' and 'subproof'
'subproof' will specify whether a subproof was present
such as a computation proof within a tlsn. Will be false,
if it does not contain a subproof
*/
verifyProof = function (data) {
	const type = getProofType(data);
	var subproof = false;
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
		}
	case ('android'):
    try {
	
	 var params = '{ "googleApiKey" : "AIzaSyCkruvXUsDIVCQubpimWlFFzDFKvv9E71Y",' +
		    '"apkDigest": ["iLVOtOJu6SqNBA16v02nZED6eWWslB1Mu4aNwqMNQ3U"],' +
		    '"apkCertDigest": ["xDk1cd/kftArCHCkk51/78EzjCbMITCaSPJfa37Sb9Y="],'+
		    '"pubKeys": ["04a9e16dd7a54826782622a38e9fc74f67d8d681de1330d30c4f3a3d81e49b3cb60d52218904accc23b2e0b5c5450d5cfc2e525f423f2496547cb816b778e98f0f"]}'

 
      if(android.verify(data, null, params)) {
        console.log("The Android Proof is valid");
				return { result: true, subproof: false };
      } else {
        console.log("The Android Proof is invalid ");
				return { result: false, subproof: false };
      }


    } catch (e) {
      console.log(e + e.stack);
      break;
    }
	default:
		console.log('Unknown proof type');
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

getProofType = function (proof) {
	const proofSlice = [
		{
			"slice": 27,
			"content": "tlsnotary notarization file",
			"proofName": "tlsn"
		},
		{
			"slice": 3,
			"content": "AP\x01",
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
