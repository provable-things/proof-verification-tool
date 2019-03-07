# Oraclize Proof Verification Tool

## Version 0.2.1

The `proof-verification-tool` allows users to _verify if an Oraclize proofs is valid_.

It can be used:

__❍__ From the **Command Line**.

It can be embedded:

__❍__ As a Module in a **Node app** (for now, not via NPM);

__❍__ In the **Browser**, in `j2v8`.

### Functions Exposed

__❍__ `getProofType(proof: string): ProofType`: accepts an _hexadecimal string_ (the proof), and returns a proof type. For now, the proof types supported are:

  * `proofType_TLSNotary`

  * `proofType_Android`

  * `proofType_Ledger`

__❍__ `verifyProof(proof: Uint8Array, ?callback): Promise<ParsedProof>`: accepts a _byte array_ (the proof), an optional callback, and returns a promise containing the following object:

```javascript
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

### :black_nib: Notes:

__❍__ The `proofType_Android` has two versions. The user should provide the _configuration parameters_ for v1 and v2 on the config file `./settings/settings.json`. These parameters are provided by the Android device and along with the Google API key they are used to generate and validate the proof. The values provided here are just examples of how they are used.

__❍__ All the newly generated `proofType_Android` proofs are **v2**.

## :computer: Use from the Command Line

Please, remember that the target is _ECMA 2015_, but if you want to use `yarn` you should have at least `node 4.2.6`.

### :page_with_curl: _Instructions_

For using the Oraclize Proof Verification Tool from the _command line_, execute the following steps:

**1)** Clone the repository:

__`❍ git clone https://github.com/oraclize/proof-verification-tool.git`__

**2)** Install the deps:

__`❍ cd proof-verification-tool && yarn install`__

**3)** Build the project:

__`❍ yarn build`__

#### :mag_right: Proof Verification

When you use the `proof-verification-tool` from the command line, you can check if the proof is valid or extract the message contained in the proof:

**4a)** Check the proof validity:

__`❍ node ./lib/cli [path to proof]`__

  * If the _proof is valid_, the tool prints on the standard output the ParsedProof (format above), exits with status code 0, and shows **SUCCESS** message;

  * If the _proof is unvalid_, the tool exits w/ status code different than 0, and shows **FAILURE** message.

**4b)** Extract the message contained in the proof:

__`❍ node ./lib/cli [path to proof] -s [path to output file]`__

  * If the _proof is valid_, the tool prints on the standard output the ParsedProof (format above), saves the proof in the specified path, and exits with status code 0;

  * If the _proof is unvalid_, the tool exits w/ status code different than 0. When the message contained in the proof is a string, the message will be written on the file as a UTF-8 string when is `{type: 'hex', value: string}`, the value will be written as binary data.

&nbsp;

## Embed in a Node App

For using the Oraclize Proof Verification Tool from a _Node app_, execute the following steps:

**1)** Clone the repository:

__`❍ git clone https://github.com/oraclize/proof-verification-tool.git`__

**2)** Install the deps:

__`❍ yarn install`__

**3)** Build the project:

__`❍ yarn build`__

**4)** Import the module in your app with:

__`❍ import {verifyProof, getProofType} from 'path to proof verification tool directory' + '/lib/index.js\'`__

The target is _ECMA 2015_, but if you want to use yarn you should have at least `node 4.8.0`.

---

**To Do**: implement an npm module

&nbsp;

## Embed in a Java App

For using the Oraclize Proof Verification Tool from a _Java app_, execute the following steps:

**1)** Clone the repository:

__`❍ git clone https://github.com/oraclize/proof-verification-tool.git`__

**2)** Install the deps:

__`❍ yarn install`__

**3)** Build the project:

__`❍ yarn build`__

**4)** Create the bundle:

__`❍ yarn browserify-node`__

The target is _ECMA 2015_, but if you want to use yarn you should have at least `node 4.8.0`.

&nbsp;

## Embed in a Browser App

Same as embed in a Node app.

If you use `browserify`, when you build the bundle, execute:

__`❍ -r fs:browserify-fs`__

&nbsp;

## :camera: Passing Proofs:

![The passing Android V2 Proof!](./img/androidV2.png)
![The passing TLSN Proof!](./img/tlsnV3b.png)
![The passing Ledger Proof!](./img/ledger.png)

&nbsp;

## :loudspeaker: Support

__❍__ If you have any issues, head on over to our
[Gitter](https://gitter.im/oraclize/ethereum-api?raw=true) channel to get timely support!

__*Happy verification!*__
