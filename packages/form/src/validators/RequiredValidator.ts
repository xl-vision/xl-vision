import { Validator } from '../types';

const RequiredValidator: Validator<boolean> = ({ field, values, rule }) => {
  if (!rule) {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const value = values[field];
  if (!value) {
    throw new Error(`The value must not be empty`);
  }
};

export default RequiredValidator;
