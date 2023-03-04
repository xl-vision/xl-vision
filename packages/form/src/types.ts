import validators from './validators';

export type ValidatorOptions<P> = {
  field: string;
  values: Record<string, any>;
  rule: P;
};

export type Validator<P = any> = {
  (options: ValidatorOptions<P>): void | Promise<void>;
};

export type Validators = typeof validators;

export type ValidatorKey = keyof Validators;

export type CustomValidatorOptions = {
  field: string;
  values: Record<string, any>;
};

export type CustomValidator = {
  (options: CustomValidatorOptions): void | Promise<void>;
};

export type Trigger = 'change' | 'blur';

export type Rule = Partial<{
  [k in ValidatorKey]: Validators[ValidatorKey] extends Validator<infer P> ? P : never;
}> & {
  message?: string;
  validator?: CustomValidator;
  trigger?: Trigger;
};

