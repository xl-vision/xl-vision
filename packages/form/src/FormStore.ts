import { EventEmitter, isObject, warning } from '@xl-vision/utils';
import { Rule, ValidatorKey } from './types';
import validators from './validator';

const GLOBAL_EVENT = Symbol('GLOABL_EVENT');

export type ValidateOptions = {
  lazy?: boolean;
};

class FormStore<T extends Record<string, any> = Record<string, any>> {
  private values: Partial<T>;

  private rules: Partial<Record<keyof T, Array<Rule>>>;

  private errors: Partial<Record<keyof T, Array<Error>>>;

  private valueEmitter: EventEmitter;

  private errorEmitter: EventEmitter;

  constructor(value: Partial<T>) {
    this.values = { ...value };
    this.rules = {};
    this.errors = {};
    this.valueEmitter = new EventEmitter();
    this.errorEmitter = new EventEmitter();
  }

  setValue(value: T): void;

  setValue<K extends keyof T>(field: K, value: T[K]): void;

  setValue<K extends keyof T>(field: K | T, value?: T[K]) {
    if (isObject(field)) {
      if (field === this.values) {
        return;
      }
      this.values = { ...field };

      Object.keys(this.values).forEach((key) => {
        this.valueEmitter.emit(key, this.values[key]);
      });
    } else {
      if (this.values[field] === value) {
        return;
      }

      this.values = {
        ...this.values,
        [field]: value,
      };

      this.valueEmitter.emit(field as PropertyKey, value);
    }

    this.valueEmitter.emit(GLOBAL_EVENT, this.values);
  }

  getValue<K extends keyof T>(field: K): T[K];

  getValue(): T;

  getValue<K extends keyof T>(field?: K) {
    if (field) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.values[field];
    }
    return this.values;
  }

  watchValue<K extends keyof T>(field: K, listener: (value: T[K]) => void): void;

  watchValue(listener: (value: Partial<T>) => void): void;

  watchValue<K extends keyof T>(
    field: K | ((value: Partial<T>) => void),
    listener?: (value: T[K]) => void,
  ) {
    if (typeof field === 'function') {
      this.valueEmitter.on(GLOBAL_EVENT, field);
      return;
    }

    if (listener) {
      this.valueEmitter.on(field, listener);
    }
  }

  unwatchValue<K extends keyof T>(field: K, listener: (value: T[K]) => void): void;

  unwatchValue(listener: (value: Partial<T>) => void): void;

  unwatchValue<K extends keyof T>(
    field: K | ((value: Partial<T>) => void),
    listener?: (value: T[K]) => void,
  ) {
    if (typeof field === 'function') {
      this.valueEmitter.off(GLOBAL_EVENT, field);
      return;
    }

    if (listener) {
      this.valueEmitter.off(field, listener);
    }
  }

  getErrors<K extends keyof T>(field: K): T[K];

  getErrors(): T;

  getErrors<K extends keyof T>(field?: K) {
    if (field) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.values[field];
    }
    return this.values;
  }

  watchError<K extends keyof T>(field: K, listener: (errors: Array<string>) => void): void;

  watchError(listener: (errors: Partial<Record<keyof T, Array<string>>>) => void): void;

  watchError<K extends keyof T>(
    field: K | ((errors: Partial<Record<keyof T, Array<string>>>) => void),
    listener?: (errors: Array<string>) => void,
  ) {
    if (typeof field === 'function') {
      this.errorEmitter.on(GLOBAL_EVENT, field);
      return;
    }

    if (listener) {
      this.errorEmitter.on(field, listener);
    }
  }

  unwatchError<K extends keyof T>(field: K, listener: (errors: Array<string>) => void): void;

  unwatchError(listener: (errors: Partial<Record<keyof T, Array<string>>>) => void): void;

  unwatchError<K extends keyof T>(
    field: K | ((errors: Partial<Record<keyof T, Array<string>>>) => void),
    listener?: (errors: Array<string>) => void,
  ) {
    if (typeof field === 'function') {
      this.errorEmitter.off(GLOBAL_EVENT, field);
      return;
    }

    if (listener) {
      this.errorEmitter.off(field, listener);
    }
  }

  setRules<K extends keyof T>(field: K, rules: Rule | Array<Rule>) {
    this.rules[field] = Array.isArray(rules) ? rules : [rules];
  }

  validate(options?: ValidateOptions): Promise<Partial<Record<keyof T, Array<string>>>>;

  validate<K extends keyof T>(field: K, options?: ValidateOptions): Promise<Array<string>>;

  async validate<K extends keyof T>(field?: K | ValidateOptions, options?: ValidateOptions) {
    let lazy: boolean | undefined;
    if (typeof field === 'object') {
      lazy = field.lazy;
    } else if (field) {
      lazy = options?.lazy;
      const errors = await this.validateField(field, { lazy });
      this.errors = {
        ...this.errors,
        [field]: errors,
      };

      this.errorEmitter.emit(field as string, errors);
      this.errorEmitter.emit(GLOBAL_EVENT, this.errors);
      return errors;
    }

    const errors: Partial<Record<keyof T, Array<string>>> = {};

    await Promise.all(
      Object.keys(this.values).map(async (key) => {
        errors[key as K] = await this.validateField(key, { lazy });
      }),
    );

    this.errors = errors;

    Object.keys(errors).forEach((key) => {
      this.errorEmitter.emit(key, errors[key]);
    });

    this.errorEmitter.emit(GLOBAL_EVENT, errors);
    return errors;
  }

  private async validateField<K extends keyof T>(
    field: K,
    { lazy }: ValidateOptions = {},
  ): Promise<Array<string>> {
    const ruleArray = this.rules[field] || [];

    const errors: Array<Error> = [];

    for (let i = 0; i < ruleArray.length; i++) {
      if (lazy && errors.length) {
        break;
      }

      const rule = ruleArray[i];
      const { message, validator, ...others } = rule;

      const messageError = message ? new Error(message) : undefined;

      const keys = Object.keys(others) as Array<ValidatorKey>;

      try {
        // eslint-disable-next-line no-await-in-loop
        await validator?.({
          field: field as string,
          values: this.values,
        });
      } catch (err) {
        errors.push(messageError ?? (err as Error));
        if (lazy) {
          break;
        }
      }

      for (let j = 0; j < keys.length; j++) {
        const key = keys[j];

        const defaultValidator = validators[key];
        if (!defaultValidator) {
          warning(true, 'unknown validator {}, please check whether passing a right key', key);
          continue;
        }

        try {
          // eslint-disable-next-line no-await-in-loop
          await defaultValidator({
            field: field as string,
            values: this.values,
            rule: others[key]!,
          });
        } catch (err) {
          errors.push(messageError ?? (err as Error));
          break;
        }
      }
    }

    return errors;
  }
}

export default FormStore;
