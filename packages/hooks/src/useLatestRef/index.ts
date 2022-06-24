import { useRef } from 'react';

const useLatestRef = <T>(t: T) => {
  const ref = useRef<T>(t);

  ref.current = t;

  return ref;
};

export default useLatestRef;
