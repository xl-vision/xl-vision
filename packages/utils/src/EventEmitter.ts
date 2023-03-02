export default class EventEmitter<
  M extends Record<PropertyKey, (...args: Array<any>) => void> = Record<
    PropertyKey,
    (...args: Array<any>) => void
  >,
> {
  private listeners: Map<keyof M, Array<M[keyof M]>>;

  constructor() {
    this.listeners = new Map();
  }

  public on<K extends keyof M>(event: K, listener: M[K]): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.push(listener);
    } else {
      this.listeners.set(event, [listener]);
    }
  }

  public off<K extends keyof M>(event: K, listener: M[K]): void {
    const listeners = this.listeners.get(event);
    if (!listeners) {
      return;
    }

    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }

    if (!listeners.length) {
      this.listeners.delete(event);
    }
  }

  public emit<K extends keyof M>(event: K, ...args: Parameters<M[K]>): void {
    const listeners = this.listeners.get(event);
    if (!listeners) {
      return;
    }
    listeners.forEach((listener) => listener(...args));
  }

  once<K extends keyof M>(event: K, listener: M[K]): void {
    const onceListener = ((...args: Parameters<M[K]>) => {
      listener(...args);
      this.off(event, onceListener);
    }) as M[K];
    this.on(event, onceListener);
  }
}
