export type Watcher<V> = (v: V) => void;

class FormStore<T extends Record<string, any> = Record<string, any>> {
  private watchers: Map<keyof T, Set<Watcher<any>>>;

  private globalWatchers: Set<Watcher<Partial<T>>>;

  private value: Partial<T>;

  constructor(value: Partial<T>) {
    this.value = { ...value };
    this.watchers = new Map();
    this.globalWatchers = new Set();
  }

  setValue<K extends keyof T>(field: K, value: T[K]) {
    this.value = {
      ...this.value,
      [field]: value,
    };
    this.dispatch(field);
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
      this.globalWatchers.add(field);
      return;
    }

    let set = this.watchers.get(field);

    if (!set) {
      set = new Set();
      this.watchers.set(field, set);
    }

    if (watcher) {
      set.add(watcher);
    }
  }

  removeWatcher<K extends keyof T>(field: K, watcher: Watcher<T[K]>): void;

  removeWatcher<K extends keyof T>(watcher: Watcher<T[K]>): void;

  removeWatcher<K extends keyof T>(field: K | Watcher<Partial<T>>, watcher?: Watcher<T[K]>) {
    if (typeof field === 'function') {
      this.globalWatchers.delete(field);
      return;
    }

    const set = this.watchers.get(field);

    if (!set) {
      return;
    }

    if (watcher) {
      set.delete(watcher);
    }

    if (!set.size) {
      this.watchers.delete(field);
    }
  }

  private dispatch<K extends keyof T>(field: K) {
    const value = this.value[field];
    const set = this.watchers.get(field);
    set?.forEach((it) => {
      it(value);
    });
    this.globalWatchers.forEach((it) => {
      it(this.value);
    });
  }
}

export default FormStore;
