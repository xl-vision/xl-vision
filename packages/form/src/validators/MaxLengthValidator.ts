import { Validator } from '../types';

const MaxLengthValidator: Validator<number> = ({ field, values, rule }) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const value = values[field];
  if (value === undefined) {
    return;
  }

  if (String(value).length > rule) {
    throw new Error(`The value length must not be greater than ${rule}`);
  }
};

export default MaxLengthValidator;
