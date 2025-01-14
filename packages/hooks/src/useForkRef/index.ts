import { isReact19, setRef } from '@xl-vision/utils';
import { Ref, useMemo } from 'react';

const useForkRef = <T>(...refs: Array<Ref<T> | undefined>): Ref<T> => {
  return useMemo(() => {
    return (value: T | null) => {
      const cbs: Array<() => void> = [];
      refs.forEach((it) => {
        const ret = setRef(it, value);

        if (isReact19 && typeof ret === 'function') {
          cbs.push(ret);
        }
      });

      if (isReact19) {
        return () => {
          cbs.forEach((it) => it());
        };
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs);
};

export default useForkRef;
