// @flow

import R from 'ramda';
import {reduceDeleteValue} from './helpers.js';
import {verifiedServers, notVerifiableServers} from './oraclize/oracles.js';
import {verifyTLS} from './tlsn-verify.js';
import {ba2str} from './tlsn/tlsn_utils.js';
import {verifyAndroid} from './android-verify.js';
import {verifyLedger} from './ledger-verify.js';
import {isComputationProof, verifyComputationProof} from './computation-verify.js';
import crypto from 'crypto';

type MainProof =
  | 'proofType_TLSNotary'
  | 'proofType_Android'
  | 'proofType_Ledger'
  | 'proofType_Native' // TODO not implemented yet
  | 'proofType_NONE'

type ExtensionProof =
  | 'computation'
  | 'proofType_NONE'

type ShiledProof =
  | 'type1'
  | 'proofType_NONE'

type VerificationStatus =
  | ['succes', '']
  | ['faild', '']
  | TLSNStatus
  | LedgerStatus
  | ComputationStatus
  | AndroidStatus

type TLSNStatus =
  | ['faild', 'wrong header']
  | ['faild', 'wrong version']
  | ['faild', 'invalid .pgsg length']
  | ['faild', 'commit hash mismatch']
  | ['faild', 'matching notary server not found']
  | ['succes', 'matching notary server not on-line']
  | ['succes', 'no exceptions']
  | ['faild', 'Signature not in chert chain']

type LedgerStatus =
  | ['succes', 'random valid']
  | ['succes', 'random invalid']
  | ['succes', 'nested valid']
  | ['succes', 'not recognized nested poof']
  | ['succes', 'subproof invalid'] // TODO

type AndroidStatus =
  | ['faild', 'verifyPayload failed: apk hash or signing cert hash mismatch']
  | ['faild', 'verifyAuthenticity failed']
  | ['faild', 'verifyPayload failed: wrong apk hash']
  | ['faild', 'verifyPayload failed: wrong signing certificate hash']
  | ['faild', 'verifyResponseSignature failed']
  | ['faild', 'verifyResponseSignature failed']
  | ['faild', 'verifyAttestationParams failed: keymasterVersion mismatch']
  | ['faild', 'verifyAttestationParams failed: keymasterSecurityLevel mismatch']
  | ['faild', 'verifyAttestationParams failed: attestationChallenge value mismatch']
  | ['faild', 'verifyAttestationParams failed: key purpose mismatch']
  | ['faild', 'verifyAttestationParams failed: key algorithm is not EC based']
  | ['faild', 'verifyAttestationParams failed: key digest mismatch']
  | ['faild', 'verifyAttestationParams failed: ecCurve mismatch']
  | ['faild', 'verifyAttestationParams failed: key was not generated on device']
  | ['succes', 'verifyAttestationParams failed: attestationSecurityLevel']

type ComputationStatus =
  | ['faild', 'unrecognized AMI provider']
  | ['faild', 'instance ID mismatch']
  | ['faild', 'signature invalid']
  | ['faild', 'archive checksum failed']

type ProofType = MainProof | ExtensionProof | ShiledProof 

type ProofStructure = {
  slice: number,
  content: string,
  proofName: ProofType,
}

export type ParsedProof = {
  mainProof: {
    proofType: MainProof,
    isVerified: boolean,
    status: VerificationStatus
  },
  extensionProof: ?{
    proofType: ExtensionProof, 
    isVerified: boolean,
    status: VerificationStatus
  },
  proofShield: ?{
    proofType: ShiledProof, 
    isVerified: boolean,
    status: VerificationStatus },
  message: string | {type: 'hex', value: string},
  proofId: string,
}

export const getProofType = (proof: string): ProofType => {
  const supportedProofs = [
    {
      slice: 27,
      content: 'tlsnotary notarization file',
      proofName: 'proofType_TLSNotary'
    },
    {
      slice: 3,
      content: 'AP\x01',
      proofName: 'proofType_Android'
    },
    {
      slice: 3,
      content: 'LP\x01',
      proofName: 'proofType_Ledger'
    }
  ];

  const compareProof = R.curry((proof: string, proofStructure: ProofStructure): ProofType => {
    const proofHeader = proof.slice(0, proofStructure.slice);
    if (proofHeader === proofStructure.content) {
      return proofStructure.proofName;
    }
    return 'proofType_NONE';
  });
  return R.compose(
    reduceDeleteValue('proofType_NONE'),
    R.map(compareProof(proof))
  )(supportedProofs);
};

const findExtensionProof = (message: ?string): ExtensionProof => {
  let extensionType;
  if (message !== null && message !== undefined && isComputationProof(message)) {
    extensionType = 'computation';
  }
  else {
    extensionType = 'proofType_NONE';
  }
  return extensionType;
};

export const verifyProof = async (proof: Uint8Array, callback: any): Promise<ParsedProof> => {
  const proofType = getProofType(ba2str(proof));
  let mainProof;
  let message;
  let extensionProof;
  switch (proofType) {
  case 'proofType_TLSNotary':{
    const parsedMessage = await verifyTLS(proof, await verifiedServers, await notVerifiableServers);
    mainProof = {proofType, isVerified: parsedMessage.isVerified, status: parsedMessage.status};
    message = parsedMessage.parsedData;
    break;
  }
  case 'proofType_Android':{
    const parsedMessage = await verifyAndroid(proof);
    mainProof = {proofType, isVerified: parsedMessage.isVerified, status: parsedMessage.status};
    message = parsedMessage.parsedData;
    break;
  }
  case 'proofType_Ledger':{
    const parsedMessage = verifyLedger(proof);
    mainProof = {proofType, isVerified: parsedMessage.isVerified, status: parsedMessage.status};
    message = parsedMessage.parsedData;
    break;
  }
  default: {
    throw new Error();
  }}
  switch (findExtensionProof(message)) {
  case 'computation': {
    const parsedMessage = verifyComputationProof(message);
    extensionProof = {proofType: 'computation', isVerified: parsedMessage.isVerified, status: parsedMessage.status};
    break;
  }}
  const parsedProof = {
    mainProof: mainProof,
    extensionProof: extensionProof,
    proofShield: null,
    message: message,
    proofId: crypto.createHash('sha256').update(proof).digest().toString('hex'),  // TODO not defined
  };
  callback && callback(parsedProof);
  return parsedProof;
};
