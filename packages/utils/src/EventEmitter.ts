export default class EventEmitter {
  private listeners: Map<string, Array<(...args: Array<any>) => void>>;

  constructor() {
    this.listeners = new Map();
  }

  public on(event: string, listener: (...args: Array<any>) => void): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.push(listener);
    } else {
      this.listeners.set(event, [listener]);
    }
  }

  public off(event: string, listener: (...args: Array<any>) => void): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  public emit(event: string, ...args: Array<any>): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      listeners.forEach((listener) => listener(...args));
    }
  }

  once(event: string, listener: (...args: Array<any>) => void): void {
    const onceListener = (...args: Array<any>) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      listener(...args);
      this.off(event, onceListener);
    };
    this.on(event, onceListener);
  }
}
