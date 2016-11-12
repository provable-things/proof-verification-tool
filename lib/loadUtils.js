var fs = require('fs'),
	vm = require('vm');


loadUtils();

//A number of the verification tools use functions from tlsn_utils
function loadUtils() {
	console.log('Pre-loading Utils...');

	assert = require('assert');
	getRandomValues = require('get-random-values');
	window = GLOBAL;

	var tlsnUtilsFile = String(fs.readFileSync('./lib/tlsn/tlsn_utils.js'));
	tlsnUtilsFile = tlsnUtilsFile.replace(/window.crypto.getRandomValues/g, 'window.getRandomValues');

	vm.runInThisContext(tlsnUtilsFile);
}
