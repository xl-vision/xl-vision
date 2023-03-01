export type Watcher<V> = (v: V) => void;

interface FormStore<T extends Record<string, any>> {
  addWatcher<K extends keyof T>(field: K, watcher: Watcher<T[K]>): void;
  addWatcher<K extends keyof T>(watcher: Watcher<T[K]>): void;
  removeWatcher<K extends keyof T>(field: K, watcher: Watcher<T[K]>): void;
  removeWatcher<K extends keyof T>(watcher: Watcher<T[K]>): void;
  getStore<K extends keyof T>(field: K): T[K];
  getStore(): T;
}

class FormStore<T extends Record<string, any>> {
  private watchers: Map<keyof T, Set<Watcher<any>>>;

  private globalWatchers: Set<Watcher<any>>;

  constructor(
    private readonly store: {
      current: Partial<T>;
    },
  ) {
    this.watchers = new Map();
    this.globalWatchers = new Set();
  }

  getStore<K extends keyof T>(field?: K) {
    if (field) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.store.current[field];
    }
    return this.store.current;
  }

  addWatcher<K extends keyof T>(field: K | Watcher<T[K]>, watcher?: Watcher<T[K]>) {
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

  removeWatcher<K extends keyof T>(field: K | Watcher<T[K]>, watcher?: Watcher<T[K]>) {
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

  dispatch<K extends keyof T>(value: T[K], field?: K) {
    const set = field ? this.watchers.get(field) : this.globalWatchers;
    set?.forEach((it) => {
      it(value);
    });
  }
}

export default FormStore;
