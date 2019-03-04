#! /usr/bin/env node
'use strict';

var _index = require('./index.js');

var _helpers = require('./helpers.js');

var _figlet = require('figlet');

var _figlet2 = _interopRequireDefault(_figlet);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _process = require('process');

var _process2 = _interopRequireDefault(_process);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _elegantSpinner = require('elegant-spinner');

var _elegantSpinner2 = _interopRequireDefault(_elegantSpinner);

var _logUpdate = require('log-update');

var _logUpdate2 = _interopRequireDefault(_logUpdate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
/* eslint-disable no-console */

const flags = {
  saveMessage: '-s'
};

//BANNER
console.log(_chalk2.default.cyan(_figlet2.default.textSync('oraclize', { font: 'Isometric1', horizontalLayout: 'default', verticalLayout: 'default' })));

//SPINNER
const frames = _ramda2.default.compose(_ramda2.default.map(() => (0, _elegantSpinner2.default)()), _ramda2.default.range)(0, _process2.default.stdout.columns);
console.log();
console.log(_chalk2.default.yellow('PRELIMINARY CHECKS IN PROGRESS'));
setInterval(function () {
  (0, _logUpdate2.default)(frames.map(x => _chalk2.default.green(x())));
}, 50);

const saveOutputPath = () => {
  return _process2.default.argv[_ramda2.default.findIndex(x => x === flags.saveMessage, _process2.default.argv) + 1];
};

const parseProof = (() => {
  var _ref = _asyncToGenerator(function* (path) {
    const parsedProof = new Uint8Array((yield (0, _helpers.readFileAsync)(path)));

    let verifiedProof;
    try {
      verifiedProof = yield (0, _index.verifyProof)(parsedProof);
      if (!verifiedProof.mainProof.isVerified) {
        throw new Error();
      }
    } catch (error) {
      throw new Error(error);
    }
    console.log();
    console.log(_chalk2.default.green('Proof file: '), path);
    console.log();
    console.log(_chalk2.default.yellow('Main proof: '), '\n ', verifiedProof.mainProof);
    console.log(_chalk2.default.yellow('Extension proof: '), '\n ', verifiedProof.extensionProof);
    console.log(_chalk2.default.yellow('Proof shield: '), '\n ', verifiedProof.proofShield);
    console.log(_chalk2.default.yellow('Message: '), '\n ', (0, _index.getMessageLen)(verifiedProof.message) < _process2.default.stdout.columns * 80 ? (0, _index.getMessageContent)(verifiedProof.message) : 'please use save message flag');

    console.log(_chalk2.default.yellow('Proof ID: '), '\n ', verifiedProof.proofId);
    if (_ramda2.default.contains(flags.saveMessage, _process2.default.argv)) {
      if (typeof verifiedProof.message === 'string') {
        yield (0, _helpers.writeFileAsync)(saveOutputPath(), verifiedProof.message);
      } else {
        yield (0, _helpers.writeFileAsync)(saveOutputPath(), Buffer.from((0, _index.getMessageContent)(verifiedProof.message, true)), 'binary');
      }
    }
  });

  return function parseProof(_x) {
    return _ref.apply(this, arguments);
  };
})();

parseProof(_process2.default.argv[2]).then(() => {
  console.log();
  console.log(_chalk2.default.green('SUCCESS'));
  _process2.default.exit(0);
}).catch(e => {
  console.log(e);
  console.log();
  console.log(_chalk2.default.red('FAILURE'));
  _process2.default.exit(255);
});