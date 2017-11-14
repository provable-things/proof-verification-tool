'use strict';
// @flow
const atob = require('atob');
const tlsn_utils = require('./tlsn/tlsn_utils.js');
var r = require('jsrsasign');

// AWS RSA public key (US East (N. Virginia))
const awsPublicCertificateRSA = '-----BEGIN CERTIFICATE-----\n\
MIIDIjCCAougAwIBAgIJAKnL4UEDMN/FMA0GCSqGSIb3DQEBBQUAMGoxCzAJBgNV\n\
BAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdTZWF0dGxlMRgw\n\
FgYDVQQKEw9BbWF6b24uY29tIEluYy4xGjAYBgNVBAMTEWVjMi5hbWF6b25hd3Mu\n\
Y29tMB4XDTE0MDYwNTE0MjgwMloXDTI0MDYwNTE0MjgwMlowajELMAkGA1UEBhMC\n\
VVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1NlYXR0bGUxGDAWBgNV\n\
BAoTD0FtYXpvbi5jb20gSW5jLjEaMBgGA1UEAxMRZWMyLmFtYXpvbmF3cy5jb20w\n\
gZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBAIe9GN//SRK2knbjySG0ho3yqQM3\n\
e2TDhWO8D2e8+XZqck754gFSo99AbT2RmXClambI7xsYHZFapbELC4H91ycihvrD\n\
jbST1ZjkLQgga0NE1q43eS68ZeTDccScXQSNivSlzJZS8HJZjgqzBlXjZftjtdJL\n\
XeE4hwvo0sD4f3j9AgMBAAGjgc8wgcwwHQYDVR0OBBYEFCXWzAgVyrbwnFncFFIs\n\
77VBdlE4MIGcBgNVHSMEgZQwgZGAFCXWzAgVyrbwnFncFFIs77VBdlE4oW6kbDBq\n\
MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHU2Vh\n\
dHRsZTEYMBYGA1UEChMPQW1hem9uLmNvbSBJbmMuMRowGAYDVQQDExFlYzIuYW1h\n\
em9uYXdzLmNvbYIJAKnL4UEDMN/FMAwGA1UdEwQFMAMBAf8wDQYJKoZIhvcNAQEF\n\
BQADgYEAFYcz1OgEhQBXIwIdsgCOS8vEtiJYF+j9uO6jz7VOmJqO+pRlAbRlvY8T\n\
C1haGgSI/A1uZUKs/Zfnph0oEI0/hu1IIJ/SKBDtN5lvmZ/IzbOPIJWirlsllQIQ\n\
7zvWbGd9c9+Rm3p04oTvhup99la7kZqevJK0QRdD/6NpCKsqP/0=\n\
-----END CERTIFICATE-----';

const awsTrustedAMIlist = ['ami-30176327', 'ami-3200c65d', 'ami-84f6f093', 'ami-1c588d73', 'ami-9cde7af3'];

//$FlowFixMe
export const verifyComputation = (rawHtml) => {
  const bodyHtml = rawHtml.substr(rawHtml.indexOf('\r\n\r\n<?xml') + 4);
  const awsXML = bodyHtml;
  //$FlowFixMe
  var awsOutputDirty = atob(awsXML.match(/<output>(.*?)<\/output>/)[1]).split('\n');
  var awsOutputClean = [];
  for (var i = 0; i < awsOutputDirty.length; i++) {
    if (awsOutputDirty[i].substr(0, 2) !== ' *') {
      awsOutputClean.push(awsOutputDirty[i]);
    }
  }
  var awsOutput = awsOutputClean.join('\n');

  //$FlowFixMe
  var oraclizeDoc = awsOutput.match(/ORACLIZE_DOC:[\s\S]*ORACLIZE_/g)[0].split('ORACLIZE_')[1];
  //$FlowFixMe
  oraclizeDoc = oraclizeDoc.substr(4, oraclizeDoc.length - 4).split('\r\r\n').join('');
  //$FlowFixMe
  var oraclizeSig = awsOutput.match(/ORACLIZE_SIG:[\s\S]*$/g)[0].split('ORACLIZE_')[1];
  oraclizeSig = oraclizeSig.substr(4, oraclizeSig.indexOf('[') - 4).split('\r\r\n').join('');
  const decodedDoc = JSON.parse(atob(oraclizeDoc));
  var awsSignature = atob(oraclizeSig).replace(/\n/g, '');

  // convert from base64 to hex
  awsSignature = tlsn_utils.ba2hex(tlsn_utils.str2ba(atob(awsSignature)));

  // check for trusted AMI
  const awsAMIvalid = (awsTrustedAMIlist.indexOf(decodedDoc.imageId) !== -1) ? true : false;

  if (!awsAMIvalid) {
    throw new Error('unrecognized AMI provided');
  }
  // get instanceId from json doc & xml (from body html)
  const awsInstanceIdDoc = decodedDoc.instanceId;
  //$FlowFixMe
  const awsInstanceIdXML = awsXML.match(/<instanceId>(.*?)<\/instanceId>/)[1];

  // check if the instance id is the same
  const awsInstanceMatch = awsInstanceIdDoc === awsInstanceIdXML;

  if (!awsInstanceMatch) {
    throw new Error('instance ID mismatch');
  }

  // Ensure document signature passes verification
  const verifier = new r.KJUR.crypto.Signature({alg: 'SHA256withRSA'});
  verifier.init(awsPublicCertificateRSA);
  verifier.updateString(atob(oraclizeDoc));
  const awsSignatureValid = verifier.verify(awsSignature);

  if (!awsSignatureValid) {
    throw new Error('signature invalid');
  }
  // archive checksum is completed on server-side
  // with the publicly trusted AMI
  const archiveChecksumPass = awsAMIvalid;

  if (!archiveChecksumPass) {
    throw new Error('archive checksum failed');
  }
};

//$FlowFixMe
export const getComputationResult =(rawHtml) => {
  try {
    const bodyHtml = rawHtml.substr(rawHtml.indexOf('\n\n<?xml') + 2);
    const awsXML = bodyHtml;
    const awsOutput = atob(awsXML.match(/<output>(.*?)<\/output>/)[1]);
    const oraclizeResult = awsOutput.match(/^ORACLIZE_RESULT:.*$/m)[0].substr(16);
    return atob(oraclizeResult);
  } catch (err) {
    throw new Error('Computation result parsing error ' + err);
  }
};


export const isComputationProof = (html: string) => {
  const compCheck1 = '</GetConsoleOutputResponse>';
  // Ensure GetConsoleOutputResponse is last element
  const validator1 = html.indexOf(compCheck1) + compCheck1.length - html.length;
  const compCheck2 = 'Server: AmazonEC2';
  const validator2 = html.indexOf(compCheck2);
  return (validator1 === 0 && validator2 !== -1);
};

export const verifyComputationProof = (html: string) => {
  let status;
  try {
    verifyComputation(html);
    status = ['succes', ''];
  }
  catch(e) {
    switch (e.message) {
    case 'unrecognized AMI provider': {
      status = ['faild', 'unrecognized AMI provider'];
      break;
    }
    case 'instance ID mismatch': {
      status = ['faild', 'instance ID mismatch'];
      break;
    }
    case 'signature invalid': {
      status = ['faild', 'signature invalid'];
      break;
    }
    case 'archive checksum failed': {
      status = ['faild', 'archive checksum failed'];
      break;
    }
    default: {
      status = ['faild', ''];
      break;
    }}
  }
  const isVerified = status[0] === 'succes' ? true : false; 
  return {status, isVerified};
};
