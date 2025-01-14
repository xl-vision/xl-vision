import { Validator } from '../types';

const MinValidator: Validator<number> = ({ field, values, rule }) => {
  const value = values[field];
  if (value === undefined) {
    return;
  }

  if (value === null || +value < rule) {
    throw new Error(`The value must not be less than ${rule}`);
  }
};

export default MinValidator;
