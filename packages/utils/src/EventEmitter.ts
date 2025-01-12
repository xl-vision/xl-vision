export default class EventEmitter<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  M extends Record<PropertyKey, (...args: any) => void> = Record<
    PropertyKey,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (...args: any) => void
  >,
> {
  private listeners: Map<keyof M, Set<M[keyof M]>>;

  constructor() {
    this.listeners = new Map();
  }

  public on<K extends keyof M>(event: K, listener: M[K]): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.add(listener);
    } else {
      this.listeners.set(event, new Set([listener]));
    }
  }

  public off<K extends keyof M>(event: K, listener: M[K]): void {
    const listeners = this.listeners.get(event);
    if (!listeners) {
      return;
    }

    listeners.delete(listener);

    if (!listeners.size) {
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
