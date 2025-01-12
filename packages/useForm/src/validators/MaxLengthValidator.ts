import { Validator } from '../types';

const MaxLengthValidator: Validator<number> = ({ field, values, rule }) => {
  const value = values[field];
  if (value === undefined) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  if (String(value).length > rule) {
    throw new Error(`The value length must not be greater than ${rule}`);
  }
};

export default MaxLengthValidator;
