import { Ref, useMemo } from 'react';

const useForkRef = <T>(...refs: Array<Ref<T> | undefined>): Ref<T> => {
  return useMemo(() => {
    return (value: T | null) => {
      refs.forEach((it) => {
        setRef(it, value);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs);
};

const setRef = <T>(ref: Ref<T> | undefined, value: T | null) => {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    (ref.current as any) = value;
  }
};

export default useForkRef;
