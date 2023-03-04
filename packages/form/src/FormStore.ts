import { EventEmitter, isObject, warning } from '@xl-vision/utils';
import { Rule, Trigger, ValidatorKey } from './types';
import validators from './validators';

export type InnerValidateOptions = {
  rules: Array<Rule>;
  eager?: boolean;
  trigger?: Trigger;
};

const GLOBAL_EVENT = Symbol('GLOABL_EVENT');

class FormStore<T extends Record<string, any> = Record<string, any>> {
  private values: Partial<T>;

  private errors: Partial<Record<keyof T, Array<string>>>;

  private valueEmitter: EventEmitter;

  private errorEmitter: EventEmitter;

  constructor(value: Partial<T>) {
    this.values = { ...value };
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

  getErrors<K extends keyof T>(field: K): Array<string>;

  getErrors(): Partial<Record<keyof T, Array<string>>>;

  getErrors<K extends keyof T>(field?: K) {
    if (field) {
      return this.errors[field];
    }
    return this.errors;
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

  validate<K extends keyof T>(
    options: Omit<InnerValidateOptions, 'rules'> & {
      rulesMap: Partial<Record<K, Array<Rule>>>;
    },
  ): Promise<Partial<Record<keyof T, Array<string>>>>;

  validate<K extends keyof T>(field: K, options: InnerValidateOptions): Promise<Array<string>>;

  async validate<K extends keyof T>(
    field:
      | K
      | (Omit<InnerValidateOptions, 'rules'> & {
          rulesMap: Partial<Record<K, Array<Rule>>>;
        }),
    options?: InnerValidateOptions,
  ) {
    if (typeof field === 'string') {
      const { eager, rules = [], trigger } = options || {};

      const errors = await this.validateField(field, { eager, rules, trigger });

      this.errors = {
        ...this.errors,
        [field]: errors,
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.errorEmitter.emit(field, errors);

      this.errorEmitter.emit(GLOBAL_EVENT, this.errors);

      return errors;
    }

    const { eager, rulesMap, trigger } = field as Omit<InnerValidateOptions, 'rules'> & {
      rulesMap: Partial<Record<K, Array<Rule>>>;
    };

    const errorsMap: Partial<Record<keyof T, Array<string>>> = {};
    this.errors = errorsMap;

    await Promise.all(
      Object.keys(this.values).map(async (_key) => {
        const key = _key as K;
        const errors = await this.validateField(key, {
          eager,
          trigger,
          rules: rulesMap[key] || [],
        });
        errorsMap[key] = errors;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.errorEmitter.emit(key, errors);
      }),
    );

    this.errorEmitter.emit(GLOBAL_EVENT, errorsMap);
    return errorsMap;
  }

  async validateField<K extends keyof T>(
    field: K,
    { eager, rules = [], trigger }: InnerValidateOptions,
  ) {
    const errors: Array<string> = [];

    for (let i = 0; i < rules.length; i++) {
      if (!eager && errors.length) {
        break;
      }

      const rule = rules[i];
      const { message, validator, trigger: ruleTrigger, ...others } = rule;

      if (!trigger && !ruleTrigger && trigger !== ruleTrigger) {
        continue;
      }

      const keys = Object.keys(others) as Array<ValidatorKey>;

      try {
        // eslint-disable-next-line no-await-in-loop
        await validator?.({
          field: field as string,
          values: this.values,
        });
      } catch (err) {
        errors.push(message ?? (err as Error).message);
        if (!eager) {
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
          errors.push(message ?? (err as Error).message);
          break;
        }
      }
    }

    return errors;
  }
}

export default FormStore;
