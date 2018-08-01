'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.writeFileAsync = exports.readFileAsync = exports.readDirAsync = exports.subtractList = exports.reduceDeleteValue = undefined;

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// $FlowFixMe
// import fs from 'fs';
const fs = require('fs');


const filterReduce = _ramda2.default.curry((wrongValue, a, b) => {
  if (a === wrongValue) {
    return b;
  }
  if (b === wrongValue) {
    return a;
  }
  return a;
});

// take valueToDelete and list if in the list there are elements different from valueToDelete return the last one of this elements.
// If not return valueToDelete
const reduceDeleteValue = exports.reduceDeleteValue = _ramda2.default.curry((valueToDelete, list) => {
  return _ramda2.default.reduce(filterReduce(valueToDelete), valueToDelete, list);
});

//  Subtract smallerList from bigger list: subtractList(['a', 'b', 'c', 'd', 'e', 'f'], ['c', 'd']) => [ 'a', 'b', 'e', 'f' ]
const subtractList = exports.subtractList = _ramda2.default.curry((biggerList, smallerList) => {
  return _ramda2.default.reject(_ramda2.default.contains(_ramda2.default.__, smallerList), biggerList);
});

const readDirAsync = exports.readDirAsync = path => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

const readFileAsync = exports.readFileAsync = path => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

// $FlowFixMe
const writeFileAsync = exports.writeFileAsync = (path, data, binary) => {
  return new Promise((resolve, reject) => {
    if (binary !== 'binary') {
      fs.writeFile(path, data, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    } else {
      fs.writeFile(path, data, 'binary', (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }
  });
};