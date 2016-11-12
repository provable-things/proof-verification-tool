# proof-verification-tool

### Install

    npm install
  
### How to use

Place proof files in the proof subdirectory (2 valid examples included)

Then run with 

    node proofVerifier
  
And all valid proof files in proof folder will be verified, including computations

The /lib/tlns/ subdirectory contains only umodified scripts from https://github.com/tlsnotary/pagesigner/tree/master/content for optimal integrity of the TLSN verification.

###TODO
Currently only does half of computation verification. Signature is not verified and checksum is not verified.
