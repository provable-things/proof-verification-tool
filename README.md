# proof-verification-tool

### Requirements

Requires Node.js v4 or higher, not backwards compatible with v0.12 or earler. Tested working with the latest versions of 4, 5, 6 and 7.

### Install

    npm install

### How to use

Place proof files in the proof subdirectory (2 valid examples included for testing, both should be passing verification)

Then run with

    node proofVerifier

Use -v option for more verbose logging

Anyfiles in the proof folder will be verified, including computations if applicable

The /lib/tlns/ subdirectory contains only umodified scripts from https://github.com/tlsnotary/pagesigner/tree/master/content for optimal integrity of the TLSN verification.
