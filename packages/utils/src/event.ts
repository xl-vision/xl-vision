import { isServer } from './env';

export type EventObject = Window | HTMLElement | Element | Document;

export type EventMap<T extends EventObject> = T extends Window
  ? WindowEventMap
  : T extends Document
    ? DocumentEventMap
    : T extends HTMLElement
      ? HTMLElementEventMap
      : T extends Element
        ? ElementEventMap
        : never;

export type EventType<
  T extends EventObject,
  K extends keyof EventMap<T>,
> = K extends keyof WindowEventMap
  ? WindowEventMap[K]
  : K extends keyof DocumentEventMap
    ? DocumentEventMap[K]
    : K extends keyof HTMLElementEventMap
      ? HTMLElementEventMap[K]
      : K extends keyof ElementEventMap
        ? ElementEventMap[K]
        : never;

export type Listener<T extends EventObject, K extends keyof EventMap<T>> = (
  this: T,
  ev: EventType<T, K>,
  options?: boolean | AddEventListenerOptions,
) => void;

export const on = <E extends EventObject, K extends keyof EventMap<E>>(
  element: E,
  type: K,
  listener: Listener<E, K>,
  options?: boolean | AddEventListenerOptions,
) => {
  if (isServer) {
    return;
  }

  element.addEventListener(type as string, listener as EventListener, options);
};

export const off = <E extends EventObject, K extends keyof EventMap<E>>(
  element: E,
  type: K,
  listener: Listener<E, K>,
  options?: boolean | AddEventListenerOptions,
) => {
  if (isServer) {
    return;
  }

  element.removeEventListener(type as string, listener as EventListener, options);
};
