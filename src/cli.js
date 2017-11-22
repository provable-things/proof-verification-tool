#! /usr/bin/env node
// @flow
/* eslint-disable no-console */

import {verifyProof} from './index.js';
import {readFileAsync, writeFileAsync} from './helpers.js';
import f from 'figlet';
import chalk from 'chalk';
import process from 'process';
import R from 'ramda';
import elegantSpinner from 'elegant-spinner';
import logUpdate from 'log-update';
import {hex2ba} from './tlsn/tlsn_utils.js';
// $FlowFixMe
const Buffer = require('buffer').Buffer;

const flags = {
  saveMessage: '-s',
};

//BANNER
console.log(chalk.cyan(f.textSync('oraclize', {font: 'Isometric1', horizontalLayout: 'default', verticalLayout: 'default'}))); 

//SPINNER
const frames = R.compose(R.map(() => elegantSpinner()), R.range)(0, process.stdout.columns);
console.log();
console.log(chalk.yellow('PRELIMINARY CHECKS IN PROGRESS'));
setInterval(function () {
  logUpdate(frames.map((x) => chalk.green(x())));
}, 50);

const saveOutputPath = () => {
  return process.argv[R.findIndex(x => x === flags.saveMessage, process.argv) + 1];
};

const parseProof = async (path) => {
  const parsedProof = new Uint8Array(await readFileAsync(path));
  const verifiedProof = await verifyProof(parsedProof);
  if (!verifiedProof.mainProof.isVerified) {
    throw new Error();
  }
  console.log(chalk.green('Proof file: '), path);
  console.log(chalk.yellow('Main proof: '),'\n ', verifiedProof.mainProof);
  console.log(chalk.yellow('Extension proof: '),'\n ', verifiedProof.extensionProof);
  console.log(chalk.yellow('Proof shield: '),'\n ', verifiedProof.proofShield);
  console.log(chalk.yellow('Message: '),'\n ', verifiedProof.message.length < process.stdout.columns * 7
    ? typeof verifiedProof.message === 'string'
      ? verifiedProof.message
      : hex2ba(verifiedProof.message.value).toString()
    : 'please use save message flag');
  console.log(chalk.yellow('Proof ID: '),'\n ', verifiedProof.proofId);
  console.log(path);
  if (R.contains(flags.saveMessage, process.argv)) {
    if(typeof verifiedProof.message === 'string') {
      await writeFileAsync(saveOutputPath(), verifiedProof.message);
    } else {
      await writeFileAsync(saveOutputPath(), Buffer(hex2ba(verifiedProof.message.value)), 'binary');
    }
  }
};

parseProof(process.argv[2]).then(() => {
  console.log(chalk.red('finish'));
  process.exit(0);
}).catch(e => {
  console.log(e);
  process.exit(255);
});
