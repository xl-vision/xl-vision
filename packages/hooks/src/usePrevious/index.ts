import { useRef } from 'react';
import useIsomorphicLayoutEffect from '../useIsomorphicLayoutEffect';

export default <T>(value: T) => {
  const ref = useRef<T>();

  useIsomorphicLayoutEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};
