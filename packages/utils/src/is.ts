export const isUndefinedOrNull = (value: unknown): value is null | undefined => value == null;

export const isObject = (value: unknown): value is object =>
  !isUndefinedOrNull(value) && typeof value === 'object';

export const isPlainObject = (item: unknown): item is Record<PropertyKey, unknown> => {
  return (
    isObject(item) &&
    // TS thinks `item is possibly null` even though this was our first guard.
    item.constructor === Object
  );
};
