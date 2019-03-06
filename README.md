# Oraclize Proof Verification Tool

## Version 0.2.1

The `proof-verification-tool` allows users to _verify if an Oraclize proofs is valid_.

It can be used:

* from the **command line**

It can be embedded:

* as a module in a **Node app** (for now, not via NPM)

* in the **browser**, in j2v8

### :woman_teacher: Functions Exposed

* `getProofType(proof: string): ProofType`: that accepts an _hexadecimal string_ (the proof) and returns a proof type. For now, the proof types supported are: `proofType_TLSNotary`, `proofType_Android`, `proofType_Ledger`.

* `verifyProof(proof: Uint8Array, ?callback): Promise<ParsedProof>`: that accepts a _byte array_ (the proof), an optional callback, and returns a promise containing the following object:

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

:black_nib: Note:

* The `proofType_Android` has two versions. The user should provide the _configuration parameters_ for v1 and v2 on the config file `./settings/settings.json`. These parameters are provided by the Android device and along with the Google API key they are used to generate and validate the proof. The values provided here are just examples of how they are used.

* All the newly generated Android proofs are v2.

## :man_technologist: Use from the Command Line

For using the Oraclize Proof Verification Tool from the _command line_, execute the following steps:

1. Clone the repository;

2. Install the deps: `yarn install`

3. Build the project `yarn build`. The target is ECMA 2015 but if you want to use yarn _you should have at least node 4.2.6_.

### :detective: Proof Verification

When you use the `proof-verification-tool` from the command line, you can just check if the proof is valid or also extract the message contained in the proof:

* To **check the proof validity** execute: `node ./lib/cli [path to proof]`.

  * If the _proof is valid_, the tool will print on the standard output the ParsedProof (above the format), and will exit with status code 0;

  * If the _proof is unvalid_, will exit with status code different than 0.

* To **extract the message** contained in the proof execute: `node ./lib/cli [path to proof] -s [path to output file]`.

  * If the _proof is valid_, the tool will print on the standard output the ParsedProof (the format is mentioned above), will save the proof in the specified path and it will exit with status code 0;

  * If the _proof is unvalid_, it will exit with status code different than 0. When the message contained in the proof is a string the message will be written on the file as a UTF-8 string when is `{type: 'hex', value: string}`, the value will be written as binary data.

## Embed in a Node App:

For using the Oraclize Proof Verification Tool from a _Node app_, execute the following steps:

1. Clone the repository

2. Install the deps: `yarn install`

3. Build the project `yarn build`.

4. Then, import the module in your app with: `import {verifyProof, getProofType} from 'path to proof verification tool directory' + '/lib/index.js\'`.

The target is ECMA 2015 but if you want to use yarn you should have at least _node 4.8.0_.

---

**To Do**: implement an npm module

## Embed in a Java App:

For using the Oraclize Proof Verification Tool from a _Java app_, execute the following steps:

1. Clone the repository

2. Install the deps: `yarn install`

3. Build the project: `yarn build`

4. Create the bundle: `yarn browserify-node`.

The target is ECMA 2015 but if you want to use yarn you should have at least _node 4.8.0_.

## Embed in a Browser App:

Same as embed in a node app. If you use browserify, when you build the bundle execute: `-r fs:browserify-fs`.
