import { raf } from './transition';

export const voidFn = () => {};

export const oneOf = <T>(array: Array<T>, item: T) => {
  return array.indexOf(item) > -1;
};

export const omit = <T extends {}, E extends keyof T>(obj: T, ...fields: Array<E>): Omit<T, E> => {
  const copy = {} as Omit<T, E>;

  Object.keys(obj).forEach((key) => {
    if (oneOf(fields, key as E)) {
      return;
    }
    copy[key as keyof Omit<T, E>] = obj[key as keyof Omit<T, E>];
  });

  return copy;
};

export const merge = <Fn extends (...args: any) => any>(
  ...fns: Array<Fn>
): ((args: Parameters<Fn>) => Array<ReturnType<Fn>>) => {
  return (args: Parameters<Fn>) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return fns.map((it) => it(args) as ReturnType<Fn>);
  };
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
