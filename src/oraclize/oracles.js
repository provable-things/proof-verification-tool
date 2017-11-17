const assert = require('assert');
const request = require('isomorphic-fetch');
const xmlParse = require('xml2js');
const R = require('ramda');
const subtractList = require('../helpers.js').subtractList;
const tlsn_utils = require('../tlsn/tlsn_utils.js');

const kernelId = 'aki-503e7402';
const snapshotIdV1Main = 'snap-cdd399f8';
const snapshotIdV1Sig = 'snap-00083b35';
const imageIDV1Main = 'ami-5e39040c';
const imageIDV1Sig = 'ami-88724fda';
const snapshotIdV2 = 'snap-2c1fab9b';
const imageIdV2 = 'ami-15192302';

const servers = require('./servers.js').servers;

async function getJSON(res) {
  const text = await res.text();
  return JSON.parse(JSON.stringify(parseSync(text)));
}

const validateServer = async (server, type) => {
  try {
    var notaryServer;
    if (type === 'sig') {
      notaryServer = server.sig;
    } else {
      notaryServer = server.main;
    }
    var res = await request(notaryServer.DI);
    if (res.status !== 200) {
      throw new Error('aws_await request_failed');
    }
    var json = await getJSON(res);
    var args = checkDescribeInstances(json.DescribeInstancesResponse, notaryServer.instanceId, notaryServer.IP, type);

    res = await request(notaryServer.DV);
    if (res.status !== 200) {
      throw new Error('aws_await request_failed');
    }
    json = await getJSON(res);
    checkDescribeVolumes(json.DescribeVolumesResponse, notaryServer.instanceId, args.volumeId, args.volAttachTime, type);
    if (typeof window === 'undefined') { //TODO proxy server to be able to access ami.amzon from browser
      res = await request(notaryServer.GU);
      if (res.status !== 200) {
        throw new Error('aws_await request_failed');
      }
      json = await getJSON(res);
      checkGetUser(json.GetUserResponse.GetUserResult, args.ownerId);
    }

    res = await request(notaryServer.GCO);
    if (res.status !== 200) {
      throw new Error('aws_await request_failed');
    }
    json = await getJSON(res);
    var pubKey = checkGetConsoleOutput(json.GetConsoleOutputResponse, notaryServer.instanceId, args.launchTime, type);

    res = await request(notaryServer.DIA);
    json = await getJSON(res);
    checkDescribeInstanceAttribute(json.DescribeInstanceAttributeResponse, notaryServer.instanceId);
    // Check for v1
    if (type !== 'main') {
      assert(getModulusFromPubKey(pubKey).toString() === server.sig.modulus.toString());
    }

    var mark = 'AWSAccessKeyId=';
    var start;
    var id;
    var ids = [];
    // "AWSAccessKeyId" should be the same to prove that the queries are made on behalf of AWS user "root".
    // The attacker can be a user with limited privileges for whom the API would report only partial information.
    var urlArray = [notaryServer.DI, notaryServer.DV, notaryServer.GU, notaryServer.GCO, notaryServer.DIA];
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
};

function parseSync(xml) {
  var error = null;
  var json = null;
  xmlParse.parseString(xml, function (innerError, innerJson) {
    error = innerError;
    json = innerJson;
  });

  if (error) {
    throw error;
  }

  if (!error && !json) {
    throw new Error('The callback was suddenly async or something.');
  }
  return json;
}

// assuming both events happened on the same day, get the time
// difference between them in seconds
// the time string looks like "2015-04-15T19:00:59.000Z"
function getSecondsDelta(later, sooner) {
  assert(later.length === 24);
  if (later.slice(0, 11) !== sooner.slice(0, 11)) {
    return 999999; // not on the same day
  }
  var laterTime = later.slice(11, 19).split(':');
  var soonerTime = sooner.slice(11, 19).split(':');
  var laterSecs = (parseInt(laterTime[0], 10) * 3600) + (parseInt(laterTime[1], 10) * 60) + parseInt(laterTime[2], 10);
  var soonerSecs = (parseInt(soonerTime[0], 10) * 3600) + (parseInt(soonerTime[1], 10) * 60) + parseInt(soonerTime[2], 10);
  return laterSecs - soonerSecs;
}

function getModulusFromPubKey(pemPubKey) {
  var b64Str = '';
  var lines = pemPubKey.split('\n');
  // omit header and footer lines
  for (var i = 1; i < (lines.length - 1); i++) {
    b64Str += lines[i];
  }
  var der = tlsn_utils.b64decode(b64Str);
  // last 5 bytes are 2 DER bytes and 3 bytes exponent, our  is the preceding 512 bytes
  var pubkey = der.slice(der.length - 517, der.length - 5);
  return pubkey;
}

function checkDescribeInstances(jsonInput, instanceId, IP, type) {
  try {
    var imageId;

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
    var reservationSet = jsonInput.reservationSet;
    var ownerId = reservationSet[0].item[0].ownerId.toString();
    var instancesSet = reservationSet[0].item[0].instancesSet;
    assert(Object.keys(instancesSet).length === 1);
    var currentInstance = instancesSet[0].item[0];
    assert(currentInstance.instanceId.toString() === instanceId);
    assert(currentInstance.imageId.toString() === imageId);
    assert(currentInstance.instanceState[0].name.toString() === 'running');
    assert(currentInstance.ipAddress.toString() === IP);
    assert(currentInstance.rootDeviceType.toString() === 'ebs');
    assert(currentInstance.rootDeviceName.toString() === '/dev/xvda');

    // Verify only for TLSNotary Proofs v1
    if ((type === 'main') || (type === 'sig')) {
      assert(currentInstance.kernelId.toString() === kernelId);
    }

    var devices = currentInstance.blockDeviceMapping;
    assert(Object.keys(devices).length === 1);
    var device = devices[0].item[0];
    assert(device.deviceName.toString() === '/dev/xvda');
    assert(device.ebs[0].status.toString() === 'attached');
    var volAttachTime = device.ebs[0].attachTime.toString();
    var volumeId = device.ebs[0].volumeId.toString();
    var launchTime = currentInstance.launchTime.toString();
    // Get seconds from "2015-04-15T19:00:59.000Z"
    assert(getSecondsDelta(volAttachTime, launchTime) <= 3);
    if ((type !== 'main') && (type !== 'sig')) {
      assert(currentInstance.virtualizationType.toString() === 'hvm');
    }
    return {ownerId: ownerId, volumeId: volumeId, volAttachTime: volAttachTime, launchTime: launchTime};
  } catch (err) {
    throw new Error('checkDescribeInstances_failed');
  }
}

function checkDescribeVolumes(json, instanceId, volumeId, volAttachTime, type) {
  try {
    var snapshotId;

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
    var volumes = json.volumeSet;
    assert(Object.keys(volumes).length === 1);

    var volume = volumes[0].item[0];
    assert(volume.volumeId.toString() === volumeId);
    assert(volume.snapshotId.toString() === snapshotId);
    assert(volume.status.toString() === 'in-use');

    var volCreateTime = volume.createTime.toString();
    var attachedVolumes = volume.attachmentSet;
    assert(Object.keys(attachedVolumes).length === 1);
    var attVolume = attachedVolumes[0].item[0];
    assert(attVolume.volumeId.toString() === volumeId);
    assert(attVolume.instanceId.toString() === instanceId);
    assert(attVolume.device.toString() === '/dev/xvda');
    assert(attVolume.status.toString() === 'attached');
    var attTime = attVolume.attachTime.toString();
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
    var timestamp = json.timestamp.toString();
    // prevent funny business: last consoleLog entry no later than 4 minutes after instance starts

    var consoleOutputB64Encoded = json.output.toString();
    var consoleOutputStr = tlsn_utils.ba2str(tlsn_utils.b64decode(consoleOutputB64Encoded));
    if ((type === 'main') || (type === 'sig')) {
      // no other string starting with xvd except for xvda
      assert(consoleOutputStr.search(/xvd[^a]/g) === -1);
      assert(getSecondsDelta(timestamp, launchTime) <= 240);
    } else {
      assert(getSecondsDelta(timestamp, launchTime) <= 300);
    }

    var pubKey;
    var beginMark = '';
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
      // beginMark = consoleOutputStr.search('TLSNotary imported main server pubkey:');
      // assert(beginMark !== -1);
      // var importedPubKey = getPubKeyFromOutput(consoleOutputStr, beginMark);
      // assert(mainPubKey === pubKey);
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

  var pubKeyBegin = beginMark + consoleOutputStr.slice(beginMark).search(pubKeyBeginMark);
  var pubKeyEnd = pubKeyBegin + consoleOutputStr.slice(pubKeyBegin).search(pubKeyEndMark) + pubKeyEndMark.length;
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

const  getVerifiedServers = async (serversList) => {
  var mainPubKey;
  var verifiedServers = [];

  for (var j = 1; j < 3; j++) {
    var servers = serversList[j];
    for (var i = 0; i < servers.length; i++) {
      var server = servers[i];
      try {
        switch (j) {
        case 1:
          mainPubKey = await validateServer(server, 'main', mainPubKey);
          await validateServer(server, 'sig', mainPubKey);
          break;
        default:
          mainPubKey = await validateServer(server, '', mainPubKey);
        }
        verifiedServers.push(server);
      }
      catch (err) {
        if (err.name === 'aws_request_failed' && j === 1) {
          break;
        } else if (err.message === 'checkGetConsoleOutput_failed'){
          break;
        } else {
          throw err;
        }
      }
    }
  }
  return verifiedServers;
};

const avaibleServers = R.flatten(servers);
const verifiedServers = (async () => await getVerifiedServers(servers))();
const notVerifiableServers = (async () => subtractList(avaibleServers, await verifiedServers))();

module.exports.getVerifiedServers = getVerifiedServers;
module.exports.validateServer = validateServer;
module.exports.avaibleServers = avaibleServers;
module.exports.verifiedServers = verifiedServers;
module.exports.notVerifiableServers = notVerifiableServers;
