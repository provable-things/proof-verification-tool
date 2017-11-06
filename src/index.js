// @flow

import R from 'ramda';
import {reduceDeleteValue} from './helpers.js';

type ProofName =
  | 'proofType_TLSNotary'
  | 'proofType_Android'
  | 'proofType_Ledger'
  | 'proofType_Native' // TODO not implemented yet
  | 'proofType_NONE'

type ProofType = {
  slice: number,
  content: string,
  proofName: ProofName,
}

type Proof = {
  proofName: ProofName,
  proofVerificationStatus: 'verified' | 'unverified',
  message: string | {type: 'hex', value: string},
  proofId: string,
}


export const getProofType = (proof: string): ProofName => {
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

  const compareProof = R.curry((proof: string, proofType: ProofType): ProofName => {
    const proofHeader = proof.slice(0, proofType.slice);
    if (proofHeader === proofType.content) {
      return proofType.proofName;
    }
    return 'proofType_NONE';
  });
  return R.compose(
    reduceDeleteValue('proofType_NONE'),
    R.map(compareProof(proof))
  )(supportedProofs);
};

export const verifyProof = (proof: string, callback: any): Proof => {
  proof + 'ciao';
  const parsedProof = {
    proofName: 'proofType_TLSNotary',
    proofVerificationStatus: 'verified',
    message: 'ciao',
    proofId: '1500',
  };
  callback && callback(parsedProof);
  return parsedProof;
};
