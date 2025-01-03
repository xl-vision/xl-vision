import { Ref } from 'react';

const setRef = <T>(ref: Ref<T> | undefined, value: T | null) => {
  if (typeof ref === 'function') {
    return ref(value) as (() => void) | undefined;
  }
  if (ref) {
    ref.current = value;
  }
};

export default setRef;
