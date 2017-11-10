// @flow

import R from 'ramda';
import {reduceDeleteValue} from './helpers.js';
import {verifiedServers, notVerifiableServers} from './oraclize/oracles.js';

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
  | 'succes'
  | 'faild'
  | 'computation: server not verified'

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

export const verifyProof = (proof: string, callback: any): ParsedProof => {
  const parsedProof = {
    mainProof: {proofType: 'proofType_TLSNotary', status: 'succes', isVerified: true},
    extensionProof: null,
    proofShield: null,
    message: 'ciao',
    proofId: '1500',
  };
  callback && callback(parsedProof);
  return parsedProof;
};

const verifyTlsn = (proof: string): [boolean, VerificationStatus] => {
  return 3;
}
const verifyComputation = (proof: string, server) => {
  return 3;
}
