#! /usr/bin/env node
// @flow
/* eslint-disable no-console */

import {verifyProof} from './index.js';
import {readFileAsync} from './helpers.js';
import f from 'figlet';
import chalk from 'chalk';
import process from 'process';
import R from 'ramda';
import elegantSpinner from 'elegant-spinner';
import logUpdate from 'log-update';

//BANNER
console.log(chalk.cyan(f.textSync('oraclize', {font: 'Isometric1', horizontalLayout: 'default', verticalLayout: 'default'}))); 

//SPINNER
const frames = R.compose(R.map(() => elegantSpinner()), R.range)(0, 80);
console.log();
console.log(chalk.yellow('VERIFING SERVERS'));
setInterval(function () {
  logUpdate(frames.map((x) => chalk.green(x())));
}, 50);

const parseProof = async (path) => {
  const parsedProof = new Uint8Array(await readFileAsync(path));
  const verifiedProof = await verifyProof(parsedProof);
  console.log(chalk.green('Proof file: '), path);
  console.log(chalk.yellow('Main proof: '),'\n ', verifiedProof.mainProof);
  console.log(chalk.yellow('Extension proof: '),'\n ', verifiedProof.extensionProof);
  console.log(chalk.yellow('Proof shield: '),'\n ', verifiedProof.proofShield);
  console.log(chalk.yellow('Message: '),'\n ', verifiedProof.message);
  console.log(chalk.yellow('Proof ID: '),'\n ', verifiedProof.proofId);
  console.log(path);
};

parseProof(process.argv[2]).then(() => {
  console.log(chalk.red('finish'));
  process.exit();
}).catch(e => {
  console.log(e);
  process.exit();
});
