import { oneOf } from '@xl-vision/utils';

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

export const isPlainObject = (item: unknown): item is Record<PropertyKey, unknown> => {
  return (
    item !== null &&
    typeof item === 'object' &&
    // TS thinks `item is possibly null` even though this was our first guard.
    item.constructor === Object
  );
};

export type DeepmergeOptions = {
  clone?: boolean;
};

export const deepMerge = <T>(
  target: T,
  source: unknown,
  options: DeepmergeOptions = { clone: true },
): T => {
  const output = options.clone ? { ...target } : target;

  if (isPlainObject(target) && isPlainObject(source)) {
    Object.keys(source).forEach((key) => {
      // Avoid prototype pollution
      if (key === '__proto__' || key === 'constructor') {
        return;
      }

      if (isPlainObject(source[key]) && key in target && isPlainObject(target[key])) {
        // Since `output` is a clone of `target` and we have narrowed `target` in this block we can cast to the same type.
        (output as Record<PropertyKey, unknown>)[key] = deepMerge(
          target[key],
          source[key],
          options,
        );
      } else {
        (output as Record<PropertyKey, unknown>)[key] = source[key];
      }
    });
  }

  return output;
};

const defaultCompare = (left: any, right: any) => Object.is(left, right);

export const shallowEqual = (left: any, right: any, compare = defaultCompare) => {
  if (compare(left, right)) {
    return true;
  }

  if (typeof left !== 'object' || !left || typeof right !== 'object' || !right) {
    return false;
  }

  const keysLeft = Object.keys(left as object);
  const keysRight = Object.keys(right as object);

  if (keysLeft.length !== keysRight.length) {
    return false;
  }

  const rightOwnProperty = Object.prototype.hasOwnProperty.bind(right);

  for (let i = 0; i < keysLeft.length; i++) {
    const key = keysLeft[i];
    if (!rightOwnProperty(key)) {
      return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const leftValue = left[key];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const rightalue = right[key];

    if (!compare(leftValue, rightalue)) {
      return false;
    }
  }

  return true;
};
