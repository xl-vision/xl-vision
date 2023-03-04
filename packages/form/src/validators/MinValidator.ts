import { Validator } from '../types';

const MinValidator: Validator<number> = ({ field, values, rule }) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const value = values[field];
  if (value === undefined) {
    return;
  }

  if (+value < rule) {
    throw new Error('min error');
  }
};

export default MinValidator;
