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

  private emitter: EventEmitter;

  constructor(value: Partial<T>) {
    this.values = { ...value };
    this.rules = {};
    this.emitter = new EventEmitter();
  }

  setValue(value: T): void;

  setValue<K extends keyof T>(field: K, value: T[K]): void;

  setValue<K extends keyof T>(field: K | T, value?: T[K]) {
    if (isObject(field)) {
      if (field === this.values) {
        return;
      }
      this.values = { ...field };
    } else {
      if (this.values[field] === value) {
        return;
      }

      this.values = {
        ...this.values,
        [field]: value,
      };

      this.emitter.emit(field as PropertyKey, value);
    }

    this.emitter.emit(GLOBAL_EVENT, this.values);
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

  on<K extends keyof T>(field: K, listener: (value: T[K]) => void): void;

  on(listener: (value: Partial<T>) => void): void;

  on<K extends keyof T>(
    field: K | ((value: Partial<T>) => void),
    listener?: (value: T[K]) => void,
  ) {
    if (typeof field === 'function') {
      this.emitter.on(GLOBAL_EVENT, field);
      return;
    }

    if (listener) {
      this.emitter.on(field, listener);
    }
  }

  off<K extends keyof T>(field: K, listener: (value: T[K]) => void): void;

  off(listener: (value: Partial<T>) => void): void;

  off<K extends keyof T>(
    field: K | ((value: Partial<T>) => void),
    listener?: (value: T[K]) => void,
  ) {
    if (typeof field === 'function') {
      this.emitter.off(GLOBAL_EVENT, field);
      return;
    }

    if (listener) {
      this.emitter.off(field, listener);
    }
  }

  setRules<K extends keyof T>(field: K, rules: Rule | Array<Rule>) {
    this.rules[field] = Array.isArray(rules) ? rules : [rules];
  }

  validate(): Promise<Partial<Record<keyof T, Array<string>>>>;

  validate<K extends keyof T>(field: K): Promise<Array<string>>;

  async validate<K extends keyof T>(field?: K, options: ValidateOptions = {}) {
    if (field) {
      return this.validateField(field, options);
    }

    const errors: Partial<Record<keyof T, Array<string>>> = {};

    await Promise.all(
      Object.keys(this.values).map(async (key) => {
        errors[key as K] = await this.validateField(key, options);
      }),
    );

    return errors;
  }

  private async validateField<K extends keyof T>(
    field: K,
    { lazy }: ValidateOptions = {},
  ): Promise<Array<string>> {
    const ruleArray = this.rules[field] || [];

    const errors: Array<string> = [];

    for (let i = 0; i < ruleArray.length; i++) {
      if (lazy && errors.length) {
        break;
      }

      const rule = ruleArray[i];
      const { message, validator, ...others } = rule;
      const keys = Object.keys(others) as Array<ValidatorKey>;

      // eslint-disable-next-line no-await-in-loop
      const error = await validator?.({
        field: field as string,
        values: this.values,
      });

      if (error) {
        errors.push(message ?? error);
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

        // eslint-disable-next-line no-await-in-loop
        const defaultError = await defaultValidator({
          field: field as string,
          values: this.values,
          rule: rule[key],
        });

        if (defaultError) {
          errors.push(message ?? defaultError);
          break;
        }
      }
    }

    return errors;
  }
}

export default FormStore;
