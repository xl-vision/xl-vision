import MaxLengthValidator from './MaxLengthValidator';
import MaxValidator from './MaxValidator';
import MinLengthValidator from './MinLengthValidator';
import MinValidator from './MinValidator';
import PatternValidator from './PatternValidator';
import RequiredValidator from './RequiredValidator';

const validators = {
  min: MinValidator,
  max: MaxValidator,
  minLength: MinLengthValidator,
  maxLength: MaxLengthValidator,
  required: RequiredValidator,
  pattern: PatternValidator,
} as const;

export default validators;
