import { isServer } from './env';

export type EventObject = Window | HTMLElement | Document;

export type EventKeys<T extends EventObject> = T extends Window
  ? keyof WindowEventMap
  : T extends Document
  ? keyof DocumentEventMap
  : T extends HTMLElement
  ? keyof HTMLElementEventMap
  : never;

export type EventType<
  T extends EventObject,
  K extends EventKeys<T>
> = K extends keyof WindowEventMap
  ? WindowEventMap[K]
  : K extends keyof DocumentEventMap
  ? DocumentEventMap[K]
  : K extends keyof HTMLElementEventMap
  ? HTMLElementEventMap[K]
  : never;

export type Listener<T extends EventObject, K extends EventKeys<T>> = (
  this: T,
  ev: EventType<T, K>,
  options?: boolean | AddEventListenerOptions,
) => any;

export const on = <E extends EventObject, T extends EventKeys<E>>(
  element: E,
  type: T,
  listener: Listener<E, T>,
  options?: boolean | AddEventListenerOptions,
) => {
  if (isServer) {
    return;
  }

  // @ts-ignore
  element.addEventListener(type, listener, options);
};

export const off = <T extends Window | HTMLElement | Document>(
  element: T,
  type: EventKeys<T>,
  listener: Listener<T, EventKeys<T>>,
  options?: boolean | EventListenerOptions,
) => {
  if (isServer) {
    return;
  }

  // @ts-ignore
  element.removeEventListener(type, listener, options);
};
