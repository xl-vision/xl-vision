export const repeat = (str: string, number: number) => {
  let s = '';
  for (let i = 0; i < number; i++) {
    s += str;
  }

  return s;
};

export const padEnd = (str: string, length: number, char: string) => {
  return str + repeat(char, length);
};

export const padStart = (str: string, length: number, char: string) => {
  return repeat(char, length) + str;
};
