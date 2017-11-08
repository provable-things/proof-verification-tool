// @flow

import R from 'ramda';
import {reduceDeleteValue} from './helpers.js';
// import {ver`

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
  proofVerificationStatus: 'verified' | 'unverified' | 'verifiedWithComputation',
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
  const proofName = getProofType(proof);
  let proofName;
  let proofVerificationStatus;
  let message;
  let proofId;
  switch (proofName) {
    case 'proofType_TLSNotary':
      proofName = 'proofType_TLSNotary';
      proofVerificationStatus = verifyTlsn(proof
  const parsedProof = {
    proofName: 'proofType_TLSNotary',
    proofVerificationStatus: 'verified',
    message: 'ciao',
    proofId: '1500',
  };
  callback && callback(parsedProof);
  return parsedProof;
};

// function isComputationProof(html) {
//   const compCheck1 = '</GetConsoleOutputResponse>';
//   // Ensure GetConsoleOutputResponse is last element
//   const validator1 = html.indexOf(compCheck1) + compCheck1.length - html.length;
// 
//   const compCheck2 = 'Server: AmazonEC2';
//   const validator2 = html.indexOf(compCheck2);
// 
//   return (validator1 === 0 && validator2 !== -1);
// }

const verifyTlsn = (proof) => {
  const verificationResult = tlsn.verify(data, verifiedServers); // -> qui abbiamo gia verificato che il tlsn sia valid
  const decryptedHtml = verificationResult[0];
  isComputationProof(decryptedHtml)
  computation.verifyComputation(decryptedHtml);
}
