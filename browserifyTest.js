//Required library dependencies for browserify
require('./browserifyMain.js');
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

console.log('normal ' + normalProof.type + ' proof passed verification=' + normalProof.result);
subproofChecker(normalProof);
console.log('corrupt ' + corruptProof.type + ' proof passed verification=' + corruptProof.result);
subproofChecker(corruptProof);
console.log('computation ' + computationProof.type + ' proof passed verification=' + computationProof.result);
subproofChecker(computationProof);

function subproofChecker(proof) {
	if (proof.subproof !== false)
		console.log('also contained a ' + proof.subproof + ' proof. Verification pass=' + proof.subproofResult);
}
