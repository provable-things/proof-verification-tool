//'use strict';
checkVersion();

require('./lib/loadUtils.js');

const fs = require('fs');

//load these dependencies on-demand only
var tlsn,
  comp;

function checkVersion() {
  if (process.version.substr(1, 1) === '0') {
    console.log('Not compatible with ' + process.version + ' of nodeJS, please use at least v4.x.x');
    console.log('exiting');
    process.exit(1);
  }
}

//fetches any files in proof folder and verifies them
function autoVerify() {
  const proofs = fs.readdirSync('./proof/');

  if (proofs.length === 0) {
    console.log('No files found in proof folder...');
    process.exit(1);
  }

  for (var i = 0; i < proofs.length; i++)
    parseProofFile('./proof/' + proofs[i]);
}

function parseProofFile(proofFile) {
  const parsedProof = new Uint8Array(fs.readFileSync(proofFile));
  verifyProof(parsedProof, proofFile);
}

function verifyProof(data, file) {
  const type = getProofType(data);
  console.log(type);
  switch (type) {
    case ('tlsn'):
      try {
        if (typeof tlsn === 'undefined')
          tlsn = require('./lib/tlsnVerify.js');

        console.log('\n##############################################\n' + parseFileName(file));
        console.log('Verifying TLSNotary proof...')

        const verificationResult = tlsn.verify(data);
        console.log('TLSNotary proof successfully verified!');

        const decryptedHtml = verificationResult[0];

        if (isComputationProof(decryptedHtml)) {
          if (typeof comp === 'undefined')
            comp = require('./lib/computationVerify.js');
          console.log('Computation proof found...');

          comp.verifyComputation(decryptedHtml);
          console.log('Computation verified!');
        }
      } catch (e) {
        console.log(e);
        break;
      }
      break;
      //placeholder
    case ('android'):
      try {
        if (typeof android === 'undefined')
          android = require('./lib/androidVerify.js');

        android.main(data);
      } catch (e) {
        console.log(e + e.stack);
        break;
      }
      break;
    default:
      console.log('##############################################');
      console.log(parseFileName(file));
      console.log('Unknown proof type');
      break;
  }
  console.log('##############################################');
}


function isComputationProof(html) {
  const compCheck1 = '</GetConsoleOutputResponse>';
  //Ensure GetConsoleOutputResponse is last element
  const validator1 = html.indexOf(compCheck1) + compCheck1.length - html.length;

  const compCheck2 = 'Server: AmazonEC2';
  const validator2 = html.indexOf(compCheck2);

  return (validator1 === 0 && validator2 !== -1);
}

function getProofType(proof) {
  const proofSlice = [
    {
      "slice": 27,
      "content": "tlsnotary notarization file",
      "proofName": "tlsn"
		},
    {
      "slice": 3,
      "content": "S01",
      "proofName": "android"
		}
	];

  for (var i = 0; i < proofSlice.length; i++) {
    var proofHeader = (typeof proof === 'object') ? ba2str(proof.slice(0, proofSlice[i].slice)) : proof.slice(0, proofSlice[i].slice);

    if (proofHeader === proofSlice[i].content) {
      return proofSlice[i].proofName;
    }
  }
}

function parseFileName(file) {
  return file.substr(file.lastIndexOf('/') + 1);
}

autoVerify();
