import { Validator } from '../types';

const RequiredValidator: Validator<boolean> = ({ field, values, rule }) => {
  if (!rule) {
    return;
  }
  const value = values[field];
  if (!value) {
    throw new Error(`The value must not be empty`);
  }
};

export default RequiredValidator;
