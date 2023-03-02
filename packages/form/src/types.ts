import validators from './validator';

export type ValidatorOptions<P> = {
  field: string;
  values: Record<string, any>;
  rule: P;
};

export type Validator<P = any> = {
  (options: ValidatorOptions<P>): void | string | Promise<void | string>;
};

export type Validators = typeof validators;

export type ValidatorKey = keyof Validators;

export type CustomValidatorOptions = {
  field: string;
  values: Record<string, any>;
};

export type CustomValidator = {
  (options: CustomValidatorOptions): void | string | Promise<void | string>;
};

export type Rule = Partial<{
  [k in ValidatorKey]: Validators[ValidatorKey] extends Validator<infer P> ? P : never;
}> & {
  message?: string;
  validator?: CustomValidator;
};
