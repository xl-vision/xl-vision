export type DeepPartial<T> = T extends object
  ? Partial<{
      [key in keyof T]: DeepPartial<T[key]>;
    }>
  : T;
