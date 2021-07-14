export type DeepPartial<T> = T extends {}
  ? Partial<
      {
        [key in keyof T]: DeepPartial<T[key]>;
      }
    >
  : T;
