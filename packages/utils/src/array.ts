// eslint-disable-next-line import/prefer-default-export
export const oneOf = <T>(array: Array<T>, item: T) => {
  return array.indexOf(item) > -1;
};
