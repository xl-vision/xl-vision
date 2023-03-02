import { EventEmitter, isObject } from '@xl-vision/utils';

export type Watcher<V> = (value: V) => void;

const GLOBAL_EVENT = Symbol('GLOABL_EVENT');

class FormStore<T extends Record<string, any> = Record<string, any>> {
  private value: Partial<T>;

  private emitter: EventEmitter;

  constructor(value: Partial<T>) {
    this.value = { ...value };
    this.emitter = new EventEmitter();
  }

  setValue(value: T): void;

  setValue<K extends keyof T>(field: K, value: T[K]): void;

  setValue<K extends keyof T>(field: K | T, value?: T[K]) {
    if (isObject(field)) {
      if (field === this.value) {
        return;
      }
      this.value = { ...field };

      this.emitter.emit(GLOBAL_EVENT, this.value);

      return;
    }

    if (this.value[field] === value) {
      return;
    }

    this.value = {
      ...this.value,
      [field]: value,
    };

    this.emitter.emit(field as PropertyKey, value);
  }

  getValue<K extends keyof T>(field: K): T[K];

  getValue(): T;

  getValue<K extends keyof T>(field?: K) {
    if (field) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.value[field];
    }
    return this.value;
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
}

export default FormStore;
