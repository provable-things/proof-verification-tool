# proof-verification-tool

## Install

    npm install

## Browserify

    browserify browserifyMain.js -o bundle.js

Load bundle.js and then verify proofs using "verifyProof" function or check proof types using "getProofType".

## Node

### Requirements

To use with Node.js, requires v4 or higher, not backwards compatible with v0.12 or earler. Tested working with the latest versions of 4, 5, 6 and 7.

### How to use

Place proof files in the proof subdirectory 

Then run with

    node proof-verifier

Any files in the proof folder will be checked and verified

### Extracting the Raw Proof Content
Each proof contains a content, which can be different according to the proof type. For the Android, TLSNotary and Computation Proof, the raw proof content is a full HTTP Response.

In order to extract it, to verify the results contained or for debug purposed, the flag --saveContent should be set to true, as in the following example:

	node proof-verifier --saveContent true

The raw proof content will then be saved in an 'output' folder, in a file named as the proof it is extracted from. If the 'output' folder doesn't exist, it will be automatically created. 
