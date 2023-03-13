const isEqual = (x: any, y: any) =>
  // eslint-disable-next-line no-self-compare
  (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y);

export default typeof Object.is === 'function' ? Object.is : isEqual;
