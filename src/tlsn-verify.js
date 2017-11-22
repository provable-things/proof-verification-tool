// @flow
// this verification uses portions from the pagesigner
// whose code is slightly modified but mostly kept intact
// for potential web re-use

const sha256 = require('sha256');
const BigInteger = require('big-integer');
const tlsnVerifyChain = require('./tlsn/verifychain/verifychain.js');
const tlsnClientFile = require('./tlsn/tlsn.js');
const tlsn_utils = require('./tlsn/tlsn_utils.js');
// $FlowFixMe
const Buffer = require('buffer').Buffer;

const Certificate = tlsnVerifyChain.Certificate;
const TLSNClientSession = tlsnClientFile.TLSNClientSession;
const decrypt_html = tlsnClientFile.decrypt_html;

const verify = (data, servers: Array<any>, notVerifiableServers: Array<any>) => {
  data = tlsn_utils.ua2ba(data);
  var offset = 0;
  var header = tlsn_utils.ba2str(data.slice(offset, offset += 29));
  if (header !== 'tlsnotary notarization file\n\n') {
    throw new Error('wrong header');
  }
  // Currently supports v1 and v2
  var version = tlsn_utils.ba2int(data.slice(offset, offset += 2));

  if (isNaN(version) || version === 0 || version > 2) {
    throw new Error('wrong version');
  }

  var cs = tlsn_utils.ba2int(data.slice(offset, offset += 2));
  var cr = data.slice(offset, offset += 32);
  var sr = data.slice(offset, offset += 32);
  var pms1 = data.slice(offset, offset += 24);
  var pms2 = data.slice(offset, offset += 24);
  var chain_serialized_len = tlsn_utils.ba2int(data.slice(offset, offset += 3));
  var chain_serialized = data.slice(offset, offset += chain_serialized_len);
  var tlsver = data.slice(offset, offset += 2);
  var tlsver_initial = data.slice(offset, offset += 2);
  var response_len = tlsn_utils.ba2int(data.slice(offset, offset += 8));
  var response = data.slice(offset, offset += response_len);
  var IV_len = tlsn_utils.ba2int(data.slice(offset, offset += 2));
  var IV = data.slice(offset, offset += IV_len);
  var sig_len = tlsn_utils.ba2int(data.slice(offset, offset += 2));
  var sig = data.slice(offset, offset += sig_len);
  var commit_hash = data.slice(offset, offset += 32);
  var notary_pubkey = data.slice(offset, offset += sig_len);

  // v2 support for time
  if (version === 2) {
    var time = data.slice(offset, offset += 4);
  }
  // start verification
  if (data.length !== offset) {
    throw new Error('invalid .pgsg length');
  }
  offset = 0;
  var chain = []; // For now we only use the 1st cert in the chain
  while (offset < chain_serialized.length) {
    var len = tlsn_utils.ba2int(chain_serialized.slice(offset, offset += 3));
    var cert = chain_serialized.slice(offset, offset += len);
    chain.push(cert);
  }

  var commonName = getCommonName(chain[0]);

  var modulus = getModulus(chain[0]);

  // Verify commit hash
  if (sha256(response).toString() !== new Buffer(commit_hash).toString('hex')) {
    throw new Error('commit hash mismatch');
  }
  var signed_data;
  // Verify sig
  if (version >= 2) {
    signed_data = sha256([].concat(commit_hash, pms2, modulus, time));
  } else {
    signed_data = sha256([].concat(commit_hash, pms2, modulus));
  }

  var signingKey;
  var commitHashVerified = false;
  var isServerVerified = 'yes';

  for (let i = 0; i < servers.length; i++) {
    let server = servers[i];
    signingKey = server.sig.modulus;
    if (verifyCommitHashSignature(signed_data, sig, signingKey)) {
      commitHashVerified = true;
      break;
    }
  }
  if (! commitHashVerified) {
    for (let i = 0; i < notVerifiableServers.length; i++) {
      let server = notVerifiableServers[i];
      if (server === undefined) {
        continue;
      }
      signingKey = server.sig.modulus;
      if (verifyCommitHashSignature(signed_data, sig, signingKey)) {
        commitHashVerified = true;
        isServerVerified = 'no';
        break;
      }
    }
  }

  if (!commitHashVerified) {
    throw new Error('Matching notary server not found');
  }

  //decrypt html and check MAC
  var s = new TLSNClientSession();
  s.__init__();
  s.unexpected_server_app_data_count = response.slice(0, 1);
  s.chosen_cipher_suite = cs;
  s.client_random = cr;
  s.server_random = sr;
  s.auditee_secret = pms1.slice(2, 2 + s.n_auditee_entropy);
  s.initial_tlsver = tlsver_initial;
  s.tlsver = tlsver;
  s.server_modulus = modulus;
  s.set_auditee_secret();
  s.auditor_secret = pms2.slice(0, s.n_auditor_entropy);
  s.set_auditor_secret();
  s.set_master_secret_half(); //#without arguments sets the whole MS
  s.do_key_expansion(); //#also resets encryption connection state
  s.store_server_app_data_records(response.slice(1));
  s.IV_after_finished = IV;
  s.server_connection_state.seq_no += 1;
  s.server_connection_state.IV = s.IV_after_finished;
  var html_with_headers = decrypt_html(s);

  return [html_with_headers, commonName, data, notary_pubkey, isServerVerified];
};

function verifyCommitHashSignature(commithash, signature, modulus) {
  //RSA verification is sig^e mod n, drop the padding and get the last 32 bytes
  var bigint_signature = new BigInteger(tlsn_utils.ba2hex(signature), 16);
  var bigint_mod = new BigInteger(tlsn_utils.ba2hex(modulus), 16);
  var bigint_exp = new BigInteger(tlsn_utils.ba2hex(tlsn_utils.bi2ba(65537)), 16);
  var bigint_result = bigint_signature.modPow(bigint_exp, bigint_mod);
  var padded_hash = tlsn_utils.hex2ba(bigint_result.toString(16));
  var hash = padded_hash.slice(padded_hash.length - 32);
  if (commithash.toString() === new Buffer(hash).toString('hex')) {
    return true;
  }
  return false;
}

function getModulus(cert) {
  var c = Certificate.decode(new Buffer(cert), 'der');
  var pk = c.tbsCertificate.subjectPublicKeyInfo.subjectPublicKey.data;
  var pkba = tlsn_utils.ua2ba(pk);
  // Expected modulus length 256, 384, 512
  var modlen = 256;
  if (pkba.length > 384) modlen = 384;
  if (pkba.length > 512) modlen = 512;
  var modulus = pkba.slice(pkba.length - modlen - 5, pkba.length - 5);
  return modulus;
}

function getCommonName(cert) {
  var c = Certificate.decode(new Buffer(cert), 'der');
  var fields = c.tbsCertificate.subject.value;
  for (var i = 0; i < fields.length; i++) {
    if (fields[i][0].type.toString() !== [2, 5, 4, 3].toString()) continue;
    //first 2 bytes are DER-like metadata
    return tlsn_utils.ba2str(fields[i][0].value.slice(2));
  }
  return 'unknown';
}

const verifyTLS = (data: Uint8Array, verifiedServers: Array<any>, notVerifiableServers: Array<any>) => {
  let status;
  let parsedData;
  try {
    const verifiedProof = verify(data, verifiedServers, notVerifiableServers);
    const isServerVerified = verifiedProof[4];
    parsedData = verifiedProof[0];
    if (isServerVerified === 'no') {
      status = ['succes', 'matching notary server not on-line'];
    }
    else {
      status = ['succes', 'no exceptions'];
    }
  }
  catch(err) {
    parsedData = '';
    switch(err.message) {
    case 'wrong header':
      status = ['faild', 'wrong header'];
      break;
    case 'wrong version':
      status = ['faild', 'wrong version'];
      break;
    case 'invalid .pgsg length':
      status = ['faild', 'invalid .pgsg length'];
      break;
    case 'commit hash mismatch':
      status = ['faild', 'commit hash mismatch'];
      break;
    case 'Matching notary server not found':
      status = ['faild', 'matching notary server not found'];
      break;
    case 'Signature not in chert chain':
      status = ['faild', 'Signature not in chert chain'];
      break;
    default:
      throw(err);
    }
  }
  const isVerified = status[0] === 'succes' ? true : false; 
  return {status, parsedData, isVerified};
};
module.exports.verify = verify;
module.exports.verifyTLS = verifyTLS;
