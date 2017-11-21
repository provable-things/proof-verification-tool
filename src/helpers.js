// @flow
import R from 'ramda';
// $FlowFixMe
// import fs from 'fs';
const fs = require('fs');

const filterReduce = R.curry((wrongValue, a, b) => {
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
export const reduceDeleteValue = R.curry( (valueToDelete, list) => {
  return R.reduce(filterReduce(valueToDelete), valueToDelete, list);
});

//  Subtract smallerList from bigger list: subtractList(['a', 'b', 'c', 'd', 'e', 'f'], ['c', 'd']) => [ 'a', 'b', 'e', 'f' ]
export const subtractList = R.curry( (biggerList, smallerList) => {
  return R.reject(R.contains(R.__, smallerList), biggerList);
});

export const readDirAsync = (path: string): any => {
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

export const readFileAsync = (path: string): any => {
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

export const writeFileAsync = (path: string, data, binary): any => {
  return new Promise((resolve, reject) => {
    if( binary !== 'binary') {
      fs.writeFile(path, data, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }else {
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
