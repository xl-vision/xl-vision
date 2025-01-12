import { EventEmitter, isObject, warning } from '@xl-vision/utils';
import { Rule, Trigger, Validator, ValidatorKey } from './types';
import validators from './validators';

export type InnerValidateOptions = {
  defaultTrigger: Trigger;
  eager?: boolean;
  rules?: Array<Rule>;
  trigger?: Trigger;
};

const GLOBAL_EVENT = Symbol('GLOABL_EVENT');

export type ErrorMap = Partial<Record<ValidatorKey | 'custom', string>>;

class FormStore<T extends Record<string, unknown> = Record<string, unknown>> {
  private values: Partial<T>;

  private errors: Partial<Record<keyof T, ErrorMap>>;

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
        const value = this.values[key];
        this.valueEmitter.emit(key, value);
      });
    } else {
      if (this.values[field] === value) {
        return;
      }

      this.values = {
        ...this.values,
        [field]: value,
      };

      // @ts-expect-error fix types error
      this.valueEmitter.emit(field, value);
    }

    this.valueEmitter.emit(GLOBAL_EVENT, this.values);
  }

  getValue<K extends keyof T>(field: K): T[K];

  getValue(): T;

  getValue<K extends keyof T>(field?: K) {
    if (field) {
      return this.values[field];
    }
    return this.values;
  }

  watchValue<K extends keyof T>(field: K, listener: (value: T[K]) => void): void;

  watchValue(listener: (value: Partial<T>) => void): void;

  watchValue<K extends keyof T>(field: K | ((value: T) => void), listener?: (value: T[K]) => void) {
    if (typeof field === 'function') {
      this.valueEmitter.on(GLOBAL_EVENT, field);
      return;
    }

    if (listener) {
      this.valueEmitter.on(field, listener);
    }
  }

  unwatchValue<K extends keyof T>(field: K, listener: (value: T[K]) => void): void;

  unwatchValue(listener: (value: T) => void): void;

  unwatchValue<K extends keyof T>(
    field: K | ((value: T) => void),
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

  getErrors<K extends keyof T>(field: K): ErrorMap;

  getErrors(): Partial<Record<keyof T, ErrorMap>>;

  getErrors<K extends keyof T>(field?: K) {
    if (field) {
      return this.errors[field];
    }
    return this.errors;
  }

  watchError<K extends keyof T>(field: K, listener: (errors: ErrorMap) => void): void;

  watchError(listener: (errors: Partial<Record<keyof T, ErrorMap>>) => void): void;

  watchError<K extends keyof T>(
    field: K | ((errors: Partial<Record<keyof T, ErrorMap>>) => void),
    listener?: (errors: ErrorMap) => void,
  ) {
    if (typeof field === 'function') {
      this.errorEmitter.on(GLOBAL_EVENT, field);
      return;
    }

    if (listener) {
      this.errorEmitter.on(field, listener);
    }
  }

  unwatchError<K extends keyof T>(field: K, listener: (errors: ErrorMap) => void): void;

  unwatchError(listener: (errors: Partial<Record<keyof T, ErrorMap>>) => void): void;

  unwatchError<K extends keyof T>(
    field: K | ((errors: Partial<Record<keyof T, ErrorMap>>) => void),
    listener?: (errors: ErrorMap) => void,
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
  ): Promise<Partial<Record<keyof T, ErrorMap>>>;

  validate<K extends keyof T>(field: K, options: InnerValidateOptions): Promise<ErrorMap>;

  async validate<K extends keyof T>(
    field:
      | K
      | (Omit<InnerValidateOptions, 'rules'> & {
          rulesMap: Partial<Record<K, Array<Rule>>>;
        }),
    options?: InnerValidateOptions,
  ) {
    if (typeof field === 'string') {
      const errorMap = await this.validateField(field, options as InnerValidateOptions);

      this.errors = {
        ...this.errors,
        [field]: errorMap,
      };

      // @ts-expect-error fix types error
      this.errorEmitter.emit(field, errorMap);

      this.errorEmitter.emit(GLOBAL_EVENT, this.errors);

      return errorMap;
    }

    const { rulesMap, ...others } = field as Omit<InnerValidateOptions, 'rules'> & {
      rulesMap: Partial<Record<K, Array<Rule>>>;
    };

    const errorsMap = {} as Partial<Record<keyof T, ErrorMap>>;
    this.errors = errorsMap;

    await Promise.all(
      Object.keys(this.values).map(async (key) => {
        const errors = await this.validateField(key, {
          ...others,
          rules: rulesMap[key as K],
        });

        errorsMap[key as K] = errors;

        this.errorEmitter.emit(key, errors);
      }),
    );

    this.errorEmitter.emit(GLOBAL_EVENT, errorsMap);
    return errorsMap;
  }

  async validateField<K extends keyof T>(
    field: K,
    { eager, rules, trigger, defaultTrigger }: InnerValidateOptions,
  ) {
    if (!rules || !rules.length) {
      return {};
    }

    const errorMap: ErrorMap = {};

    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      const {
        message: globalMessage,
        validator,
        trigger: ruleTrigger = defaultTrigger,
        ...others
      } = rule;

      const keys = Object.keys(others) as Array<ValidatorKey>;

      if (trigger && ruleTrigger !== trigger) {
        keys.forEach((it) => {
          const message = this.errors[field]?.[it];
          if (message !== undefined) {
            errorMap[it] = message;
          }
        });

        continue;
      }

      try {
        // eslint-disable-next-line no-await-in-loop
        await validator?.({
          field: field as string,
          values: this.values,
        });
      } catch (error) {
        errorMap.custom = globalMessage || (error as Error).message;
        if (!eager) {
          return errorMap;
        }
      }

      for (let j = 0; j < keys.length; j++) {
        const key = keys[j];

        const defaultValidator = validators[key] as Validator<unknown>;
        if (!defaultValidator) {
          warning(true, 'unknown validator {}, please check whether passing a right key', key);
          continue;
        }

        const ruleData = others[key];

        const { value, message } =
          typeof ruleData === 'object' && 'value' in ruleData
            ? ruleData
            : typeof ruleData === 'string'
              ? {
                  value: true,
                  message: ruleData,
                }
              : { value: ruleData, message: globalMessage };

        try {
          // eslint-disable-next-line no-await-in-loop
          await defaultValidator({
            field: field as string,
            values: this.values,
            rule: value!,
          });
        } catch (error) {
          errorMap[key] = message || (error as Error).message;
          if (!eager) {
            return errorMap;
          }
        }
      }
    }

    return errorMap;
  }
}

export default FormStore;
