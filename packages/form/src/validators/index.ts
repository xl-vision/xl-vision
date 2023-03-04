import MaxValidator from './MaxValidator';
import MinValidator from './MinValidator';
import RequiredValidator from './RequiredValidator';

const validators = {
  min: MinValidator,
  max: MaxValidator,
  required: RequiredValidator,
} as const;

export default validators;
