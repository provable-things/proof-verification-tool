// @flow
const r = require('jsrsasign');
// $FlowFixMe
const Buffer = require('buffer').Buffer;

/*  Proof Serialization 
 *
 *  |proof_type|app_key_1|ledger_cert|codehash|elapsed_time|n_random_bytes|commitment_nonce|signature1|session_pub_key| signature2
 *  |   3     |  65     | 2+var-len |   32   |     8      |      1       |      32        | 2+var-len|       65      |  2+var-len
 *
 *
 *
 */

export const verify = (data: Uint8Array) => {
  const proofBuffer = Buffer.from(data);
  const ledgerRootKey = '047fb956469c5c9b89840d55b43537e66a98dd4811ea0a27224272c2e5622911e8537a2f8e86a46baec82864e98dd01e9ccc2f8bc5dfc9cbe5a91a290498dd96e4';
  const lenCert = proofBuffer.readUInt8((3+65+1)) + 2;
  const appKey1 = proofBuffer.slice(3, 3 + 65);
  let ledgerCert = proofBuffer.slice(3+65, 3+65+ lenCert);
  const extractedCodeHash = proofBuffer.slice(3+65+lenCert, 3+65+lenCert+32);
  const randomCodeHash = Buffer.from('fd94fa71bc0ba10d39d464d0d8f465efeef0a2764e3887fcc9df41ded20f505c', 'hex');
  let type;
  if (extractedCodeHash.equals(randomCodeHash)) {
    type = 'random';
  } else {
    type = 'none';
  }
  
  const sig = new r.crypto.Signature({alg: 'SHA256withECDSA'});
  var params = {xy: ledgerRootKey, curve: 'secp256k1'};  
  var key = r.KEYUTIL.getKey(params);                                                                                         
  sig.init(key);
  sig.updateHex('fe' + appKey1.toString('hex'));
  return [type, sig.verify(ledgerCert.toString('hex'))];
};

export const verifyRandom = (data: Uint8Array) => {  
  const proofBuffer = Buffer.from(data);
  const lenCert = proofBuffer.readUInt8((3+65+1)) + 2;
  let appKey1 = proofBuffer.slice(3, 3 + 65);
  const codeHash = proofBuffer.slice(3+65+lenCert, 3+65+lenCert+32);  
  const ledgerProofLen = 3 + 65 + lenCert + 32;
  
  // queryId, elapsedTime, nRandomBytes, commitmentNonce
  const commitmentPayloadLen = 32+8+1+32;
  const tosign1 = proofBuffer.slice(ledgerProofLen, ledgerProofLen + commitmentPayloadLen);
  
  // Signature over commitmentPayload done by session key pair
  const sig1offset = ledgerProofLen + commitmentPayloadLen;
  const sig1len  = proofBuffer.readUInt8(sig1offset+1) + 2;
  const sig1 = proofBuffer.slice(sig1offset, sig1offset + sig1len);
  const sig2offset = sig1offset + sig1len + 65;
  const sessionKeyOffset = sig1offset + sig1len;
  
  const sig2len = proofBuffer.readUInt8(sig2offset+1) + 2;
  const sig2 = proofBuffer.slice(sig2offset, sig2offset + sig2len);
  let sessionKey = proofBuffer.slice(sessionKeyOffset, sessionKeyOffset + 65);
  const role_byte = Buffer.from([0x1]);
  let tosign2 = Buffer.concat([role_byte, sessionKey, codeHash ], 1+65+32);
  let params = {xy: sessionKey.toString('hex'), curve: 'secp256k1'};  

  let sig1Obj = new r.crypto.Signature({alg: 'SHA256withECDSA'});
  sessionKey = r.KEYUTIL.getKey(params);                                                                                         
  sig1Obj.init(sessionKey);
  sig1Obj.updateHex(tosign1.toString('hex'));  
  let sig2Obj = new r.crypto.Signature({alg: 'SHA256withECDSA'});
  params = {xy: appKey1.toString('hex'), curve: 'secp256k1'};
  appKey1 = r.KEYUTIL.getKey(params);
  sig2Obj.init(appKey1);
  sig2Obj.updateHex(tosign2.toString('hex'));
  sig1[0] = 48;
  return (sig1Obj.verify(sig1.toString('hex')) && sig2Obj.verify(sig2.toString('hex')));
};

export const verifyLedger = (data: Uint8Array) => {
  const result = verify(data);
  let status;
  if(result[1]) {
    switch(result[0]) {
    case 'random': {
      const result = verifyRandom(data);
      if (result) {
        status = ['succes', 'random valid'];
      } else {
        status = ['succes', 'random invalid'];
      }
      break;
    }
    default:
      status = ['succes', 'not recognized nested poof'];
    }
  } else {
    status = ['faild', ''];
  }
  const isVerified = status[0] === 'succes' ? true : false; 
  const parsedData = '';
  return {isVerified, status, parsedData};
};
