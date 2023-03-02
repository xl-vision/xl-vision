import validatorMap from './validator';

export type ValidatorOptions<P, T, K extends keyof T> = {
  field: K;
  value: T[K];
  values: T;
  data: P;
};

export type Validator<P = any, T = any> = {
  <K extends keyof T>(options: ValidatorOptions<P, T, K>): void | Promise<void>;
};

export type ValidatorMap = typeof validatorMap;

export type ValidatorKey = keyof ValidatorMap;

export type Rule = {
  [k in ValidatorKey]: ValidatorMap[ValidatorKey] extends Validator<infer P> ? P : never;
} & {
  message?: string;
  validator?: Validator;
};
