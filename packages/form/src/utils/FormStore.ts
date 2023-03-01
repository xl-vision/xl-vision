export type Watcher<V> = (v: V) => void;

export default class FormStore<T extends Record<string, any>> {
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

  getStore(field?: keyof T) {
    if (field) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.store.current[field];
    }
    return this.store;
  }

  addWatcher<K extends keyof T>(watcher: Watcher<T[K]>, field?: K) {
    if (!field) {
      this.globalWatchers.add(watcher);
      return;
    }

    let set = this.watchers.get(field);

    if (!set) {
      set = new Set();
      this.watchers.set(field, set);
    }

    set.add(watcher);
  }

  removeWatcher<K extends keyof T>(watcher: Watcher<T[K]>, field?: K) {
    if (!field) {
      this.globalWatchers.delete(watcher);
      return;
    }

    const set = this.watchers.get(field);

    if (!set) {
      return;
    }

    set.delete(watcher);

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
