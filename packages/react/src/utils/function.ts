import { raf } from './transition';

/* eslint-disable @typescript-eslint/no-unsafe-return */
export const voidFn = () => {};

export const omit = <T extends {}, E extends keyof T>(obj: T, ...fields: Array<E>) => {
  const copy = { ...obj };
  fields.forEach((field) => {
    delete copy[field];
  });

  return copy as Omit<T, E>;
};

export const throttleByAnimationFrame = <Fn extends (...args: Array<any>) => any>(fn: Fn) => {
  let cancel: (() => void) | undefined;

  let ret: ReturnType<Fn> | undefined;

  const later = (args: Parameters<Fn>) => () => {
    cancel = undefined;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    ret = fn(...args);
  };

  const throttle = (...args: Parameters<Fn>) => {
    if (cancel === undefined) {
      cancel = raf(later(args));
    }
    return ret;
  };

  throttle.cancel = cancel;

  return throttle;
};
