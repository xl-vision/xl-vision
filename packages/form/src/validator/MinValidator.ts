import { Validator } from '../types';

const MinValidator: Validator<number> = ({ data, value }) => {
  if (+value < data) {
    throw new Error('');
  }
};

export default MinValidator;
