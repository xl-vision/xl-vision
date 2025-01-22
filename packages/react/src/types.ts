export type DeepPartial<T> = T extends
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | symbol
  | Date
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | ((...v: any) => unknown)
  ? T | undefined
  : // Arrays, Sets and Maps and their readonly counterparts have their items made
    // deeply partial, but their own instances are left untouched
    T extends Array<infer ArrayType>
    ? Array<DeepPartial<ArrayType>>
    : T extends ReadonlyArray<infer ArrayType>
      ? ReadonlyArray<ArrayType>
      : T extends Set<infer SetType>
        ? Set<DeepPartial<SetType>>
        : T extends ReadonlySet<infer SetType>
          ? ReadonlySet<SetType>
          : T extends Map<infer KeyType, infer ValueType>
            ? Map<DeepPartial<KeyType>, DeepPartial<ValueType>>
            : T extends ReadonlyMap<infer KeyType, infer ValueType>
              ? ReadonlyMap<DeepPartial<KeyType>, DeepPartial<ValueType>>
              : // ...and finally, all other objects.
                {
                  [K in keyof T]?: DeepPartial<T[K]>;
                };

export type RefInstance<P extends object, E extends Element | void = void> = P &
  (E extends void
    ? {}
    : {
        nativeElement: E | null;
      });
