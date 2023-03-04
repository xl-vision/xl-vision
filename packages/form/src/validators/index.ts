import MinValidator from './MinValidator';

const validators = {
  min: MinValidator,
  max: MinValidator,
} as const;

export default validators;
