'use strict';

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

function verifyCommitHashSignature(commithash, signature, modulus) {
  //RSA verification is sig^e mod n, drop the padding and get the last 32 bytes
  const bigint_signature = new BigInteger(tlsn_utils.ba2hex(signature), 16);
  const bigint_mod = new BigInteger(tlsn_utils.ba2hex(modulus), 16);
  const bigint_exp = new BigInteger(tlsn_utils.ba2hex(tlsn_utils.bi2ba(65537)), 16);
  const bigint_result = bigint_signature.modPow(bigint_exp, bigint_mod);
  const padded_hash = tlsn_utils.hex2ba(bigint_result.toString(16));
  const hash = padded_hash.slice(padded_hash.length - 32);
  if (commithash.toString() === Buffer.from(hash).toString('hex')) return true;
  return false;
}

function getModulus(cert) {
  const c = Certificate.decode(Buffer.from(cert), 'der');
  const pk = c.tbsCertificate.subjectPublicKeyInfo.subjectPublicKey.data;
  const pkba = tlsn_utils.ua2ba(pk);
  // Expected modulus length 256, 384, 512
  let modlen = 256;
  if (pkba.length > 384) modlen = 384;
  if (pkba.length > 512) modlen = 512;
  const modulus = pkba.slice(pkba.length - modlen - 5, pkba.length - 5);
  return modulus;
}

function getCommonName(cert) {
  const c = Certificate.decode(Buffer.from(cert), 'der');
  const fields = c.tbsCertificate.subject.value;
  for (let i = 0; i < fields.length; i++) {
    if (fields[i][0].type.toString() !== [2, 5, 4, 3].toString()) continue;
    //first 2 bytes are DER-like metadata
    return tlsn_utils.ba2str(fields[i][0].value.slice(2));
  }
  return 'unknown';
}

const verify = (data, servers, notVerifiableServers) => {
  data = tlsn_utils.ua2ba(data);
  let offset = 0;
  const header = tlsn_utils.ba2str(data.slice(offset, offset += 29));
  if (header !== 'tlsnotary notarization file\n\n') throw new Error('wrong header');

  // Currently supports v1 and v2
  const version = tlsn_utils.ba2int(data.slice(offset, offset += 2));
  if (isNaN(version) || version === 0 || version > 2) throw new Error('wrong version');

  const cs = tlsn_utils.ba2int(data.slice(offset, offset += 2));
  const cr = data.slice(offset, offset += 32);
  const sr = data.slice(offset, offset += 32);
  const pms1 = data.slice(offset, offset += 24);
  const pms2 = data.slice(offset, offset += 24);
  const chain_serialized_len = tlsn_utils.ba2int(data.slice(offset, offset += 3));
  const chain_serialized = data.slice(offset, offset += chain_serialized_len);
  const tlsver = data.slice(offset, offset += 2);
  const tlsver_initial = data.slice(offset, offset += 2);
  const response_len = tlsn_utils.ba2int(data.slice(offset, offset += 8));
  const response = data.slice(offset, offset += response_len);
  const IV_len = tlsn_utils.ba2int(data.slice(offset, offset += 2));
  const IV = data.slice(offset, offset += IV_len);
  const sig_len = tlsn_utils.ba2int(data.slice(offset, offset += 2));
  const sig = data.slice(offset, offset += sig_len);
  const commit_hash = data.slice(offset, offset += 32);
  const notary_pubkey = data.slice(offset, offset += sig_len);
  let time = 0;
  // v2 support for time
  if (version === 2) time = data.slice(offset, offset += 4);

  // start verification
  if (data.length !== offset) throw new Error('invalid .pgsg length');

  offset = 0;
  let chain = []; // For now we only use the 1st cert in the chain
  while (offset < chain_serialized.length) {
    const len = tlsn_utils.ba2int(chain_serialized.slice(offset, offset += 3));
    const cert = chain_serialized.slice(offset, offset += len);
    chain.push(cert);
  }
  const commonName = getCommonName(chain[0]);
  const modulus = getModulus(chain[0]);
  // Verify commit hash
  if (sha256(response).toString() !== Buffer.from(commit_hash).toString('hex')) throw new Error('commit hash mismatch');

  let signed_data = 0;
  // Verify sig
  if (version >= 2) signed_data = sha256([].concat(commit_hash, pms2, modulus, time));else signed_data = sha256([].concat(commit_hash, pms2, modulus));

  let signingKey;
  let commitHashVerified = false;
  let isServerVerified = 'yes';
  for (let i = 0; i < servers.length; i++) {
    let server = servers[i];
    signingKey = server.sig.modulus;
    if (verifyCommitHashSignature(signed_data, sig, signingKey)) {
      commitHashVerified = true;
      break;
    }
  }
  if (!commitHashVerified) {
    for (let j = 0; j < notVerifiableServers.length; j++) {
      let server = notVerifiableServers[j];
      if (server === undefined) continue;

      signingKey = server.sig.modulus;
      if (verifyCommitHashSignature(signed_data, sig, signingKey)) {
        commitHashVerified = true;
        isServerVerified = 'no';
        break;
      }
    }
  }
  if (!commitHashVerified) throw new Error('Matching notary server not found');

  //decrypt html and check MAC
  let s = new TLSNClientSession();
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
  const html_with_headers = decrypt_html(s);
  return [html_with_headers, commonName, data, notary_pubkey, isServerVerified];
};

const verifyTLS = (data, verifiedServers, notVerifiableServers) => {
  let status;
  let parsedData;
  try {
    const verifiedProof = verify(data, verifiedServers, notVerifiableServers);
    const isServerVerified = verifiedProof[4];
    parsedData = verifiedProof[0];
    if (isServerVerified === 'no') status = ['success', 'matching notary server not on-line'];else status = ['success', 'no exceptions'];
  } catch (err) {
    parsedData = '';
    switch (err.message) {
      case 'wrong header':
        status = ['failed', 'wrong header'];
        break;
      case 'wrong version':
        status = ['failed', 'wrong version'];
        break;
      case 'invalid .pgsg length':
        status = ['failed', 'invalid .pgsg length'];
        break;
      case 'commit hash mismatch':
        status = ['failed', 'commit hash mismatch'];
        break;
      case 'Matching notary server not found':
        status = ['failed', 'matching notary server not found'];
        break;
      case 'Signature not in chert chain':
        status = ['failed', 'Signature not in chert chain'];
        break;
      default:
        throw err;
    }
  }
  const isVerified = status[0] === 'success' ? true : false;
  return { status, parsedData, isVerified };
};

module.exports.verify = verify;
module.exports.verifyTLS = verifyTLS;