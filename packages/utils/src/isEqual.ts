const isEqual = (x: unknown, y: unknown) =>
  (x === y && (x !== 0 || 1 / x === 1 / (y as number))) || (x !== x && y !== y);

export default typeof Object.is === 'function' ? Object.is : isEqual;
