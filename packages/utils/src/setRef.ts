import { Ref } from 'react';

const setRef = <T>(ref: Ref<T> | undefined | null, value: T | null) => {
  if (typeof ref === 'function') {
    return ref(value);
  }
  if (ref) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    ref.current = value;
  }
};

export default setRef;
