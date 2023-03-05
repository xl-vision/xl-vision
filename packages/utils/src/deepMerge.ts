import { isPlainObject } from './is';

export type DeepmergeOptions = {
  clone?: boolean;
};

const deepMerge = <T, S>(
  target: T,
  source: S,
  options: DeepmergeOptions = { clone: true },
): T & S => {
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

  return output as T & S;
};

export default deepMerge;
