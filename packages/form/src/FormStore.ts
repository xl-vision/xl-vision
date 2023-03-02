import { EventEmitter, isObject } from '@xl-vision/utils';
import { Rule } from './types';

export type Watcher<V> = (value: V) => void;

const GLOBAL_EVENT = Symbol('GLOABL_EVENT');

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

  addWatcher<K extends keyof T>(field: K, watcher: Watcher<T[K]>): void;

  addWatcher<K extends keyof T>(watcher: Watcher<T[K]>): void;

  addWatcher<K extends keyof T>(field: K | Watcher<Partial<T>>, watcher?: Watcher<T[K]>) {
    if (typeof field === 'function') {
      this.emitter.on(GLOBAL_EVENT, field);
      return;
    }

    if (watcher) {
      this.emitter.on(field, watcher);
    }
  }

  removeWatcher<K extends keyof T>(field: K, watcher: Watcher<T[K]>): void;

  removeWatcher<K extends keyof T>(watcher: Watcher<T[K]>): void;

  removeWatcher<K extends keyof T>(field: K | Watcher<Partial<T>>, watcher?: Watcher<T[K]>) {
    if (typeof field === 'function') {
      this.emitter.off(GLOBAL_EVENT, field);
      return;
    }

    if (watcher) {
      this.emitter.off(field, watcher);
    }
  }

  validate(): Partial<Record<keyof T, Array<string>>>;

  validate<K extends keyof T>(field: K): Array<string>;

  validate<K extends keyof T>(field?: K) {
    if (field) {
      return this.validateField(field);
    }

    const errors: Partial<Record<keyof T, Array<string>>> = {};

    Object.keys(this.values).forEach((key) => {
      errors[key as K] = this.validateField(key);
    });

    return errors;
  }

  private validateField<K extends keyof T>(field: K): Array<string> {
    const { values } = this;
    const value = values[field];

    return [];
  }
}

export default FormStore;
