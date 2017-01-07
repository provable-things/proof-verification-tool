if (typeof window === 'undefined' && typeof self !== 'undefined')
	window = self;

window.verify_tlsn = require('./lib/tlsn-verify.js');
window.verify_comp = require('./lib/computation-verify.js');
window.android = require('./lib/android-verify.js');
window.oracle = require('./lib/oraclize/oracles.js');

//fs is only used for this example and can be omitted
//depending on the method that the proof's content is fetched
//and vm is being used to load the contents of main.
const fs = require('fs');
const vm = require("vm-browserify");

/*
Fetch contents of proofs
Can be done in various ways for production
The following usage is for example only, as the contents
are basically entered this way as static strings
*/
var tlsnv1 = fs.readFileSync('./proof/tlsnv1.proof');
var tlsnv2 = fs.readFileSync('./proof/tlsnv2.proof');
var computationProofContent = fs.readFileSync('./proof/computation.proof');
var androidProofContent = fs.readFileSync('./proof/computation.proof');

var main = fs.readFileSync('./browserifyMain.js');
//remove module requirements as we'll be loading them globally from here
vm.runInThisContext(main.toString().replace(/(const|var) \w+ = require\(\'.*\r?\n/g, ''));

var servers = getVerifiedServers();
//after fetching and before sending for verification
//convert content to Uint8Array
var v1 = verifyProof(new Uint8Array(tlsnv1), servers);
var v2 = verifyProof(new Uint8Array(tlsnv2), servers);
var computationProof = verifyProof(new Uint8Array(computationProofContent), servers);
var androidProof = verifyProof(new Uint8Array(androidProofContent), servers);

console.log('normal proof v1 passed verification=' + v1.result);
subproofChecker(v1.subproof);
console.log('normal proof v2 passed verification=' + v2.result);
subproofChecker(v2.subproof);
console.log('computation proof passed verification=' + computationProof.result);
subproofChecker(computationProof.subproof);
console.log('android proof passed verification=' + androidProof.result);
subproofChecker(androidProof.subproof);


function consoleDivider() {
	console.log('##############################################');
}

function subproofChecker(subproof) {
	if (subproof !== false)
		console.log('also contained a ' + subproof + ' proof');
}
