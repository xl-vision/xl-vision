import { Validator } from '../types';

const PatternValidator: Validator<RegExp> = ({ field, values, rule }) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const value = values[field];
  if (!rule.test(value as string)) {
    throw new Error(`The value does not match regex '${rule}'`);
  }
};

export default PatternValidator;
