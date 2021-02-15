import { EventHandler, SyntheticEvent } from 'react';
import { isServer } from './env';

export type EventNameForElement<T extends Window | HTMLElement | Document> = T extends Window
  ? keyof WindowEventMap
  : T extends Document
  ? keyof DocumentEventMap
  : T extends HTMLElement
  ? keyof HTMLElementEventMap
  : never;

export type EventForElement<
  T extends Window | HTMLElement | Document,
  K extends EventNameForElement<T>
> = K extends keyof WindowEventMap
  ? WindowEventMap[K]
  : K extends keyof DocumentEventMap
  ? DocumentEventMap[K]
  : K extends keyof HTMLElementEventMap
  ? HTMLElementEventMap[K]
  : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Listener<
  T extends Window | HTMLElement | Document,
  K extends EventNameForElement<T>
> = (this: T, ev: EventForElement<T, K>, options?: boolean | AddEventListenerOptions) => any;

export const on = <T extends Window | HTMLElement | Document>(
  element: T,
  type: EventNameForElement<T>,
  listener: Listener<T, EventNameForElement<T>>,
  options?: boolean | AddEventListenerOptions,
) => {
  if (isServer) {
    return;
  }
  element.addEventListener(type, listener, options);
};

export const off = <T extends Window | HTMLElement | Document>(
  element: T,
  type: EventNameForElement<T>,
  listener: Listener<T, EventNameForElement<T>>,
  options?: boolean | EventListenerOptions,
) => {
  if (isServer) {
    return;
  }
  element.removeEventListener(type, listener, options);
};

export const mergeNativeEvents = <
  T extends Window | HTMLElement | Document,
  K extends EventNameForElement<T>
>(
  ...listeners: Array<Listener<T, K> | undefined>
) => {
  return function listener(
    this: T,
    e: EventForElement<T, K>,
    options?: boolean | EventListenerOptions,
  ) {
    listeners.forEach((it) => {
      if (it) {
        it.call(this, e, options);
      }
    });
  };
};

export const mergeEvents = <E extends SyntheticEvent<any>>(
  ...handlers: Array<EventHandler<E> | undefined>
) => {
  return (e: E) => {
    handlers.forEach((it) => {
      if (it) {
        it(e);
      }
    });
  };
};
