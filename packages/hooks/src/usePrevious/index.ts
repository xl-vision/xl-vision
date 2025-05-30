import { useRef } from 'react';
import useIsomorphicLayoutEffect from '../useIsomorphicLayoutEffect';

const usePrevious = <T>(value: T) => {
  const ref = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export default usePrevious;
