# proof-verification-tool

**version 0.2.0**

This tool can be used to verify the validity of an Oraclize proof. It can be embedded either as a module in a node app (for now not via NPM), in the browser in j2v8, or it can be used from the command line.

The functions exposed are:

1. `getProofType(proof: string): ProofType`: that accepts an hexadecimal string (the proof) and returns a proof type. For now the proof types supported are: `proofType_TLSNotary`, `proofType_Android`, `proofType_Ledger`.

2. `verifyProof(proof: Uint8Array, ?callback): Promise<ParsedProof>`: that accepts a byte array (the proof), an optional callback and returns a promise containing the following object:
```
    {
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
```

## Use from command line

First clone the repository, install the deps `yarn install` and build the project `yarn build`. The target is ECMA 2015 but if you want to use yarn you should have at least node 4.8.0

When you use the `proof-verification-tool` from the command line you can just check if the proof is valid or also extract the message contained in the proof:

1. to check if a proof is valid do `node ./lib/cli [path to proof]` if the proof is valid the tool will print on the standard output the ParsedProof (above the format) and will exit with status code 0, if not will exit with status code different than 0.

2. to extract the message contained in the proof you should do `node ./lib/cli [path to proof] -s [path to output file]` if the proof is valid the tool will print on the standard output the ParsedProof (the format is mentioned above), will save the proof in the specified path and it will exit with status code 0, if not it will exit with status code different than 0. When the message contained in the proof is a string the message will be written on the file as a UTF-8 string when is `{type: 'hex', value: string}`, the value will be written as binary data.

## Embed in a node app:

First clone the repository, install the deps `yarn install` and build the project `yarn build`. The target is ECMA 2015 but if you want to use yarn you should have at least node 4.8.0

Then you can just import the module in your app with:
```
import {verifyProof, getProofType} from 'path to proof verification tool directory' + '/lib/index.js\'
```

TODO: npm module

## Embed in a java app:

First clone the repository, install the deps `yarn install`, build the project `yarn build` and create the bundle with `yarn browserify-node`. The target is ECMA 2015 but if you want to use yarn you should have at least node 4.8.0

## Embed in a browser app:

Same as embed in a node app. If you use browserify when you build the bundle you should do `-r fs:browserify-fs`
