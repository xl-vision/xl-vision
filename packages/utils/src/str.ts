// eslint-disable-next-line import/prefer-default-export
export const padEnd = (str: string, length: number, char: string) => {
  let s = str;
  for (let i = 0; i < length; i++) {
    s += char;
  }

  return s;
};
