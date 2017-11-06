const vm = require('vm');

loadUtils();

// A number of the verification tools use functions from tlsn_utils
function loadUtils() {
  console.log('Pre-loading Utils...');

  global.assert = require('assert');
  global.atob = require('atob');
  global.btoa = require('btoa');
  global.getRandomValues = require('get-random-values');
  global.fs = require('fs');
  var tlsnUtilsFile = String(fs.readFileSync('./tlsn/tlsn_utils.js'));
  tlsnUtilsFile = tlsnUtilsFile.replace(/window.crypto.getRandomValues/g, 'getRandomValues');
  vm.runInThisContext(tlsnUtilsFile);
}
