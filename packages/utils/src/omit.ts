import { oneOf } from './array';

const omit = <T extends object, E extends keyof T>(obj: T, ...fields: Array<E>): Omit<T, E> => {
  const copy = {} as Omit<T, E>;

  Object.keys(obj).forEach((key) => {
    if (oneOf(fields, key as E)) {
      return;
    }
    copy[key as keyof Omit<T, E>] = obj[key as keyof Omit<T, E>];
  });

  return copy;
};

export default omit;
