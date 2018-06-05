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
import {hex2ba} from './tlsn/tlsn_utils.js';

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
  | ['success', '']
  | ['failed', '']
  | TLSNStatus
  | LedgerStatus
  | ComputationStatus
  | AndroidStatus

type TLSNStatus =
  | ['failed', 'wrong header']
  | ['failed', 'wrong version']
  | ['failed', 'invalid .pgsg length']
  | ['failed', 'commit hash mismatch']
  | ['failed', 'matching notary server not found']
  | ['success', 'matching notary server not on-line']
  | ['success', 'no exceptions']
  | ['failed', 'Signature not in chert chain']

type LedgerStatus =
  | ['success', 'random valid']
  | ['success', 'random invalid']
  | ['success', 'nested valid']
  | ['success', 'not recognized nested poof']
  | ['success', 'subproof invalid'] // TODO

type AndroidStatus =
  | ['failed', 'verifyPayload failed: apk hash or signing cert hash mismatch']
  | ['failed', 'verifyAuthenticity failed']
  | ['failed', 'verifyPayload failed: wrong apk hash']
  | ['failed', 'verifyPayload failed: wrong signing certificate hash']
  | ['failed', 'verifyResponseSignature failed']
  | ['failed', 'verifyResponseSignature failed']
  | ['failed', 'verifyAttestationParams failed: keymasterVersion mismatch']
  | ['failed', 'verifyAttestationParams failed: keymasterSecurityLevel mismatch']
  | ['failed', 'verifyAttestationParams failed: attestationChallenge value mismatch']
  | ['failed', 'verifyAttestationParams failed: key purpose mismatch']
  | ['failed', 'verifyAttestationParams failed: key algorithm is not EC based']
  | ['failed', 'verifyAttestationParams failed: key digest mismatch']
  | ['failed', 'verifyAttestationParams failed: ecCurve mismatch']
  | ['failed', 'verifyAttestationParams failed: key was not generated on device']
  | ['success', 'verifyAttestationParams failed: attestationSecurityLevel']

type ComputationStatus =
  | ['failed', 'unrecognized AMI provider']
  | ['failed', 'instance ID mismatch']
  | ['failed', 'signature invalid']
  | ['failed', 'archive checksum failed']

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

export const getMessageLen = (message: string | {type: 'hex', value: string}) =>
  typeof message === 'string'
    ? message.length
    : hex2ba(message.value).toString().length;

export const getMessageContent = (message: string | {type: 'hex', value: string}, bin: boolean = false) =>
  typeof message === 'string'
    ? message
    : bin ? hex2ba(message.value) : hex2ba(message.value).toString();

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
    // $FlowFixMe
    proofId: crypto.createHash('sha256').update(proof).digest().toString('hex'),  // TODO not defined
  };
  callback && callback(parsedProof);
  return parsedProof;
};
