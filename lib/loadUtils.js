const fs = require('fs'),
	vm = require('vm');

loadUtils();

//A number of the verification tools use functions from tlsn_utils
function loadUtils() {
	console.log('Pre-loading Utils...');

	global.assert = require('assert');
	global.atob = require('atob');
	global.btoa = require('btoa');
	global.cbor = require('cbor')
	global.URLSafeBase64 = require('urlsafe-base64');
	global.getRandomValues = require('get-random-values');
	global.r = require('jsrsasign');
	var tlsnUtilsFile = String(fs.readFileSync('./lib/tlsn/tlsn_utils.js'));
	tlsnUtilsFile = tlsnUtilsFile.replace(/window.crypto.getRandomValues/g, 'getRandomValues');
	vm.runInThisContext(tlsnUtilsFile);
}
