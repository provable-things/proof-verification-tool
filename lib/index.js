'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyProof = exports.getMessageContent = exports.getMessageLen = exports.getProofType = undefined;

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _helpers = require('./helpers.js');

var _oracles = require('./oraclize/oracles.js');

var _tlsnVerify = require('./tlsn-verify.js');

var _tlsn_utils = require('./tlsn/tlsn_utils.js');

var _androidVerify = require('./android-verify.js');

var _ledgerVerify = require('./ledger-verify.js');

var _computationVerify = require('./computation-verify.js');

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// TODO

const getProofType = exports.getProofType = proof => {
  const supportedProofs = [{
    slice: 27,
    content: 'tlsnotary notarization file',
    proofName: 'proofType_TLSNotary'
  }, {
    slice: 3,
    content: 'AP\x01',
    proofName: 'proofType_Android'
  }, {
    slice: 3,
    content: 'AP\x02',
    proofName: 'proofType_Android_v2'
  }, {
    slice: 3,
    content: 'LP\x01',
    proofName: 'proofType_Ledger'
  }];

  const compareProof = _ramda2.default.curry((proof, proofStructure) => {
    const proofHeader = proof.slice(0, proofStructure.slice);
    if (proofHeader === proofStructure.content) {
      return proofStructure.proofName;
    }
    return 'proofType_NONE';
  });
  return _ramda2.default.compose((0, _helpers.reduceDeleteValue)('proofType_NONE'), _ramda2.default.map(compareProof(proof)))(supportedProofs);
};

const findExtensionProof = message => {
  let extensionType;
  if (message !== null && message !== undefined && (0, _computationVerify.isComputationProof)(message)) {
    extensionType = 'computation';
  } else {
    extensionType = 'proofType_NONE';
  }
  return extensionType;
};

const getMessageLen = exports.getMessageLen = message => typeof message === 'string' ? message.length : (0, _tlsn_utils.hex2ba)(message.value).toString().length;

const getMessageContent = exports.getMessageContent = (message, bin = false) => typeof message === 'string' ? message : bin ? (0, _tlsn_utils.hex2ba)(message.value) : (0, _tlsn_utils.hex2ba)(message.value).toString();

const verifyProof = exports.verifyProof = (() => {
  var _ref = _asyncToGenerator(function* (proof, callback) {
    const proofType = getProofType((0, _tlsn_utils.ba2str)(proof));
    let mainProof;
    let message;
    let extensionProof;
    switch (proofType) {
      case 'proofType_TLSNotary':
        {
          const parsedMessage = yield (0, _tlsnVerify.verifyTLS)(proof, (yield _oracles.verifiedServers), (yield _oracles.notVerifiableServers));
          mainProof = { proofType, isVerified: parsedMessage.isVerified, status: parsedMessage.status };
          message = parsedMessage.parsedData;
          break;
        }
      case 'proofType_Android':
        {
          const parsedMessage = yield (0, _androidVerify.verifyAndroid)(proof, 'v1');
          mainProof = { proofType, isVerified: parsedMessage.isVerified, status: parsedMessage.status };
          message = parsedMessage.parsedData;
          break;
        }
      case 'proofType_Android_v2':
        {
          const parsedMessage = yield (0, _androidVerify.verifyAndroid)(proof, 'v2');
          mainProof = { proofType, isVerified: parsedMessage.isVerified, status: parsedMessage.status };
          message = parsedMessage.parsedData;
          break;
        }
      case 'proofType_Ledger':
        {
          const parsedMessage = (0, _ledgerVerify.verifyLedger)(proof);
          mainProof = { proofType, isVerified: parsedMessage.isVerified, status: parsedMessage.status };
          message = parsedMessage.parsedData;
          break;
        }
      default:
        {
          throw new Error();
        }}
    switch (findExtensionProof(message)) {
      case 'computation':
        {
          const parsedMessage = (0, _computationVerify.verifyComputationProof)(message);
          extensionProof = { proofType: 'computation', isVerified: parsedMessage.isVerified, status: parsedMessage.status };
          break;
        }}
    const parsedProof = {
      mainProof: mainProof,
      extensionProof: extensionProof,
      proofShield: null,
      message: message,
      // $FlowFixMe
      proofId: _crypto2.default.createHash('sha256').update(proof).digest().toString('hex') // TODO not defined
    };
    callback && callback(parsedProof);
    return parsedProof;
  });

  return function verifyProof(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();