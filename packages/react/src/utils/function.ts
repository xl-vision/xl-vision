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

export const functionMerge = <Fn extends (...args: Array<any>) => any>(
  ...fns: Array<Fn>
): ((...args: Parameters<Fn>) => Array<ReturnType<Fn>>) => {
  return (...args: Parameters<Fn>) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return fns.map((it) => it(...args) as ReturnType<Fn>);
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return ret;
  };

  throttle.cancel = cancel;

  return throttle;
};

export function isPlainObject(item: unknown): item is Record<keyof any, unknown> {
  return (
    item !== null &&
    typeof item === 'object' &&
    // TS thinks `item is possibly null` even though this was our first guard.
    // @ts-expect-error
    item.constructor === Object
  );
}

export interface DeepmergeOptions {
  clone?: boolean;
}

export default function deepMerge<T>(
  target: T,
  source: unknown,
  options: DeepmergeOptions = { clone: true },
): T {
  const output = options.clone ? { ...target } : target;

  if (isPlainObject(target) && isPlainObject(source)) {
    Object.keys(source).forEach((key) => {
      // Avoid prototype pollution
      if (key === '__proto__' || key === 'constructor') {
        return;
      }

      if (isPlainObject(source[key]) && key in target && isPlainObject(target[key])) {
        // Since `output` is a clone of `target` and we have narrowed `target` in this block we can cast to the same type.
        (output as Record<keyof any, unknown>)[key] = deepMerge(target[key], source[key], options);
      } else {
        (output as Record<keyof any, unknown>)[key] = source[key];
      }
    });
  }

  return output;
}
