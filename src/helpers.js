import R from 'ramda';

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
