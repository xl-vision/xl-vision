import validators from './validators';

export type ValidatorOptions<P> = {
  field: string;
  values: Record<string, unknown>;
  rule: P;
};

export type Validator<P> = {
  (options: ValidatorOptions<P>): void | Promise<void>;
};

export type Validators = typeof validators;

export type ValidatorKey = keyof Validators;

export type CustomValidatorOptions = {
  field: string;
  values: Record<string, unknown>;
};

export type CustomValidator = {
  (options: CustomValidatorOptions): void | Promise<void>;
};

export type Trigger = 'change' | 'blur' | 'custom';

export type Rule = Partial<{
  [k in ValidatorKey]: Validators[k] extends Validator<infer P>
    ? P | { value: P; message: string } | (P extends boolean ? string : never)
    : never;
}> & {
  message?: string;
  validator?: CustomValidator;
  trigger?: Trigger;
};
