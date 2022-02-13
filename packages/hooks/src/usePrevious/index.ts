import { useLayoutEffect } from '@xl-vision/hooks';
import { useRef } from 'react';

export default <T>(value: T) => {
  const ref = useRef<T>();

  useLayoutEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};
