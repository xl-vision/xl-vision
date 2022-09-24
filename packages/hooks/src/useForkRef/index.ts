import { setRef } from '@xl-vision/utils';
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

export default useForkRef;
