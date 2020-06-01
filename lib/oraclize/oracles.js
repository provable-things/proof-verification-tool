'use strict';

let getJSON = (() => {
  var _ref = _asyncToGenerator(function* (res) {
    const text = yield res.text();
    return JSON.parse(JSON.stringify(parseSync(text)));
  });

  return function getJSON(_x) {
    return _ref.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const assert = require('assert');
const request = require('isomorphic-fetch');
const xmlParse = require('xml2js');
const R = require('ramda');
const subtractList = require('../helpers.js').subtractList;
const tlsn_utils = require('../tlsn/tlsn_utils.js');

const kernelId = 'aki-503e7402';
const snapshotIdV1Main = ['snap-cdd399f8'];
const snapshotIdV1Sig = ['snap-00083b35'];
const imageIDV1Main = ['ami-5e39040c'];
const imageIDV1Sig = ['ami-88724fda'];
// const snapshotIdV2 = 'snap-2c1fab9b' // necessary for [oraclize5, oraclize6, oraclize7]
// const imageIdV2 = 'ami-15192302' // necessary for [oraclize5, oraclize6, oraclize7]

const snapshotIdV2 = ['snap-03bae56722ceec3f0', 'snap-0fa4d717595514c9e', 'snap-0aae1b6ca8c4b0f8d', 'snap-001724fd6e3219a8b', 'snap-0d6e71fc4113c1d7f', 'snap-0d65665f4afaf28f8', 'snap-0f2a4af7bbcaf3374', 'snap-03a7cfbcc835aae69', 'snap-01bd7dcd6b89c4784', 'snap-03c1d1eaab2ded518'];

const imageIdV2 = ['ami-1f447c65', 'ami-0900465cc4d168b18', 'ami-05fd672d486340db9', 'ami-004bb38dca2efe5cf', 'ami-0fc7d2d0c4a3fe3f5', 'ami-01887359c36e2e246', 'ami-0d9bdb20c502dbb32', 'ami-01fe7595953c2753b', 'ami-0d0829459bf2597b0', 'ami-0f558579909742612'];

const servers = require('./servers.js').servers;

const validateServer = (() => {
  var _ref2 = _asyncToGenerator(function* (server, type) {
    try {
      let notaryServer = null;
      if (type === 'sig') notaryServer = server.sig;else notaryServer = server.main;
      let res = yield request(notaryServer.DI);
      if (res.status !== 200) throw new Error('aws_await request_failed');
      let json = yield getJSON(res);
      const args = checkDescribeInstances(json.DescribeInstancesResponse, notaryServer.instanceId, notaryServer.IP, type);
      res = yield request(notaryServer.DV);
      if (res.status !== 200) throw new Error('aws_await request_failed');
      json = yield getJSON(res);
      checkDescribeVolumes(json.DescribeVolumesResponse, notaryServer.instanceId, args.volumeId, args.volAttachTime, type);
      if (typeof window === 'undefined') {
        //TODO proxy server to be able to access ami.amzon from browser
        res = yield request(notaryServer.GU);
        if (res.status !== 200) throw new Error('aws_await request_failed');
        json = yield getJSON(res);
        checkGetUser(json.GetUserResponse.GetUserResult, args.ownerId);
      }
      res = yield request(notaryServer.GCO);
      if (res.status !== 200) throw new Error('aws_await request_failed');
      json = yield getJSON(res);
      const pubKey = checkGetConsoleOutput(json.GetConsoleOutputResponse, notaryServer.instanceId, args.launchTime, type);
      res = yield request(notaryServer.DIA);
      json = yield getJSON(res);
      checkDescribeInstanceAttribute(json.DescribeInstanceAttributeResponse, notaryServer.instanceId);
      // Check for v1
      if (type !== 'main') assert(getModulusFromPubKey(pubKey).toString() === server.sig.modulus.toString());
      const mark = 'AWSAccessKeyId=';
      let start;
      let id;
      let ids = [];
      // "AWSAccessKeyId" should be the same to prove that the queries are made on behalf of AWS user "root".
      // The attacker can be a user with limited privileges for whom the API would report only partial information.
      const urlArray = [notaryServer.DI, notaryServer.DV, notaryServer.GU, notaryServer.GCO, notaryServer.DIA];
      for (const url of urlArray) {
        start = url.search(mark) + mark.length;
        id = url.slice(start, start + url.slice(start).search('&'));
        ids.push(id);
      }
      assert(new Set(ids).size === 1); // eslint-disable-line
      return pubKey;
    } catch (err) {
      throw err;
    }
  });

  return function validateServer(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
})();

function parseSync(xml) {
  let error = null;
  let json = null;
  xmlParse.parseString(xml, function (innerError, innerJson) {
    error = innerError;
    json = innerJson;
  });
  if (error) throw error;
  if (!error && !json) throw new Error('The callback was suddenly async or something.');
  return json;
}

// assuming both events happened on the same day, get the time
// difference between them in seconds
// the time string looks like "2015-04-15T19:00:59.000Z"
function getSecondsDelta(later, sooner) {
  assert(later.length === 24);
  if (later.slice(0, 11) !== sooner.slice(0, 11)) return 999999; // not on the same day
  const laterTime = later.slice(11, 19).split(':');
  const soonerTime = sooner.slice(11, 19).split(':');
  const laterSecs = parseInt(laterTime[0], 10) * 3600 + parseInt(laterTime[1], 10) * 60 + parseInt(laterTime[2], 10);
  const soonerSecs = parseInt(soonerTime[0], 10) * 3600 + parseInt(soonerTime[1], 10) * 60 + parseInt(soonerTime[2], 10);
  return laterSecs - soonerSecs;
}

function getModulusFromPubKey(pemPubKey) {
  let b64Str = '';
  const lines = pemPubKey.split('\n');
  // omit header and footer lines
  for (let i = 1; i < lines.length - 1; i++) b64Str += lines[i];

  const der = tlsn_utils.b64decode(b64Str);
  // last 5 bytes are 2 DER bytes and 3 bytes exponent, our  is the preceding 512 bytes
  const pubkey = der.slice(der.length - 517, der.length - 5);
  return pubkey;
}

function checkDescribeInstances(jsonInput, instanceId, IP, type) {
  try {
    let imageId;
    switch (type) {
      case 'main':
        imageId = imageIDV1Main;
        break;
      case 'sig':
        imageId = imageIDV1Sig;
        break;
      default:
        imageId = imageIdV2;
    }
    const reservationSet = jsonInput.reservationSet;
    const ownerId = reservationSet[0].item[0].ownerId.toString();
    const instancesSet = reservationSet[0].item[0].instancesSet;
    assert(Object.keys(instancesSet).length === 1);
    const currentInstance = instancesSet[0].item[0];
    assert(currentInstance.instanceId.toString() === instanceId);
    assert(imageId.includes(currentInstance.imageId.toString()));
    assert(currentInstance.instanceState[0].name.toString() === 'running');
    assert(currentInstance.ipAddress.toString() === IP);
    assert(currentInstance.rootDeviceType.toString() === 'ebs');
    assert(currentInstance.rootDeviceName.toString() === '/dev/xvda');
    // Verify only for TLSNotary Proofs v1
    if (type === 'main' || type === 'sig') assert(currentInstance.kernelId.toString() === kernelId);
    const devices = currentInstance.blockDeviceMapping;
    assert(Object.keys(devices).length === 1);
    const device = devices[0].item[0];
    assert(device.deviceName.toString() === '/dev/xvda');
    assert(device.ebs[0].status.toString() === 'attached');
    const volAttachTime = device.ebs[0].attachTime.toString();
    const volumeId = device.ebs[0].volumeId.toString();
    const launchTime = currentInstance.launchTime.toString();
    // Get seconds from "2015-04-15T19:00:59.000Z"
    assert(getSecondsDelta(volAttachTime, launchTime) <= 3);
    if (type !== 'main' && type !== 'sig') assert(currentInstance.virtualizationType.toString() === 'hvm');
    return { ownerId: ownerId, volumeId: volumeId, volAttachTime: volAttachTime, launchTime: launchTime };
  } catch (err) {
    throw new Error('checkDescribeInstances_failed');
  }
}

function checkDescribeVolumes(json, instanceId, volumeId, volAttachTime, type) {
  try {
    let snapshotId = null;
    switch (type) {
      case 'main':
        snapshotId = snapshotIdV1Main;
        break;
      case 'sig':
        snapshotId = snapshotIdV1Sig;
        break;
      default:
        snapshotId = snapshotIdV2;
    }
    const volumes = json.volumeSet;
    assert(Object.keys(volumes).length === 1);
    const volume = volumes[0].item[0];
    assert(volume.volumeId.toString() === volumeId);
    assert(snapshotId.includes(volume.snapshotId.toString()));
    assert(volume.status.toString() === 'in-use');
    const volCreateTime = volume.createTime.toString();
    const attachedVolumes = volume.attachmentSet;
    assert(Object.keys(attachedVolumes).length === 1);
    const attVolume = attachedVolumes[0].item[0];
    assert(attVolume.volumeId.toString() === volumeId);
    assert(attVolume.instanceId.toString() === instanceId);
    assert(attVolume.device.toString() === '/dev/xvda');
    assert(attVolume.status.toString() === 'attached');
    const attTime = attVolume.attachTime.toString();
    assert(volAttachTime === attTime);
    // Crucial: volume was created from snapshot and attached at the same instant
    // currentInstance guarantees that there was no time window to modify it
    assert(getSecondsDelta(attTime, volCreateTime) === 0);
  } catch (err) {
    throw new Error('checkDescribeVolumes_failed');
  }
}

function checkGetConsoleOutput(json, instanceId, launchTime, type) {
  try {
    assert(json.instanceId.toString() === instanceId);
    const timestamp = json.timestamp.toString();
    // prevent funny business: last consoleLog entry no later than 4 minutes after instance starts
    const consoleOutputB64Encoded = json.output.toString();
    const consoleOutputStr = tlsn_utils.ba2str(tlsn_utils.b64decode(consoleOutputB64Encoded));
    if (type === 'main' || type === 'sig') {
      // no other string starting with xvd except for xvda
      assert(consoleOutputStr.search(/xvd[^a]/g) === -1);
      assert(getSecondsDelta(timestamp, launchTime) <= 240);
    }
    let pubKey = null;
    let beginMark = '';
    switch (type) {
      case 'main':
        beginMark = consoleOutputStr.search('TLSNotary main server pubkey which is embedded into the signing server:');
        assert(beginMark !== -1);
        pubKey = getPubKeyFromOutput(consoleOutputStr, beginMark);
        assert(pubKey.length > 0);
        break;
      case 'sig':
        beginMark = consoleOutputStr.search('TLSNotary siging server pubkey:');
        assert(beginMark !== -1);
        pubKey = getPubKeyFromOutput(consoleOutputStr, beginMark);
        assert(pubKey.length > 0);
        // beginMark = consoleOutputStr.search('TLSNotary imported main server pubkey:')
        // assert(beginMark !== -1)
        // var importedPubKey = getPubKeyFromOutput(consoleOutputStr, beginMark)
        // assert(mainPubKey === pubKey)
        break;
      default:
        beginMark = consoleOutputStr.search('PageSigner public key for verification');
        assert(beginMark !== -1);
        pubKey = getPubKeyFromOutput(consoleOutputStr, beginMark);
        assert(pubKey.length > 0);
    }
    return pubKey;
  } catch (err) {
    throw new Error('checkGetConsoleOutput_failed');
  }
}

function getPubKeyFromOutput(consoleOutputStr, beginMark) {
  const pubKeyBeginMark = '-----BEGIN PUBLIC KEY-----';
  const pubKeyEndMark = '-----END PUBLIC KEY-----';
  const pubKeyBegin = beginMark + consoleOutputStr.slice(beginMark).search(pubKeyBeginMark);
  const pubKeyEnd = pubKeyBegin + consoleOutputStr.slice(pubKeyBegin).search(pubKeyEndMark) + pubKeyEndMark.length;
  return consoleOutputStr.slice(pubKeyBegin, pubKeyEnd);
}

// "userData" allows to pass an arbitrary script to the instance at launch. It MUST be empty.
// currentInstance is a sanity check because the instance is stripped of the code which parses userData.
function checkDescribeInstanceAttribute(json, instanceId) {
  try {
    assert(json.instanceId.toString() === instanceId);
    assert(json.userData.toString() === '');
  } catch (err) {
    throw new Error('checkDescribeInstanceAttribute_failed');
  }
}

function checkGetUser(json, ownerId) {
  try {
    assert(json[0].User[0].UserId.toString() === ownerId);
    assert(json[0].User[0].Arn.toString().slice(-(ownerId.length + ':root'.length)) === ownerId + ':root');
  } catch (err) {
    throw new Error('checkGetUser_failed');
  }
}

const getVerifiedServers = (() => {
  var _ref3 = _asyncToGenerator(function* (serversList) {
    let mainPubKey;
    let verifiedServers = [];
    for (let j = 1; j < 3; j++) {
      // the array offset represents the TLSNotary version (we start with j = 1 for that reason)
      let servers = serversList[j];
      for (let i = 0; i < servers.length; i++) {
        const server = servers[i];
        if (server.verifiable === false) continue;
        try {
          switch (j) {// the array offset represents the TLSNotary version
            case 1:
              mainPubKey = yield validateServer(server, 'main', mainPubKey);
              yield validateServer(server, 'sig', mainPubKey);
              break;
            default:
              mainPubKey = yield validateServer(server, '', mainPubKey);
          }
          verifiedServers.push(server);
        } catch (err) {
          if (err.name === 'aws_request_failed' && j === 1) break;else if (err.message === 'checkGetConsoleOutput_failed') break;else throw err;
        }
      }
    }
    return verifiedServers;
  });

  return function getVerifiedServers(_x4) {
    return _ref3.apply(this, arguments);
  };
})();

const avaibleServers = R.flatten(servers);
const verifiedServers = _asyncToGenerator(function* () {
  return yield getVerifiedServers(servers);
})();
const notVerifiableServers = _asyncToGenerator(function* () {
  return subtractList(avaibleServers, (yield verifiedServers));
})();

module.exports.getVerifiedServers = getVerifiedServers;
module.exports.validateServer = validateServer;
module.exports.avaibleServers = avaibleServers;
module.exports.verifiedServers = verifiedServers;
module.exports.notVerifiableServers = notVerifiableServers;