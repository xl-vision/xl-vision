import { useRef } from 'react';
import useLayoutEffect from '../useLayoutEffect';

export default <T>(value: T) => {
  const ref = useRef<T>();

  useLayoutEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};
