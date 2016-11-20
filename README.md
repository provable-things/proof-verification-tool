# proof-verification-tool

## Install

    npm install

## Browserify

    browserify browserifyMain.js > bundle.js

Load bundle.js and then verify proofs using "verifyProof()" function.

## Node

### Requirements

To use with Node.js, requires v4 or higher, not backwards compatible with v0.12 or earler. Tested working with the latest versions of 4, 5, 6 and 7.

### How to use

Place proof files in the proof subdirectory (2 valid examples and 1 corrupted included for testing)

Then run with

    node proofVerifier

Any files in the proof folder will be checked and verified
