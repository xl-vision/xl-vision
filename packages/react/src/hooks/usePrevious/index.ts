import React from 'react';
import { useLayoutEffect } from '@xl-vision/hooks';

export default <T>(value: T) => {
  const ref = React.useRef<T>();

  useLayoutEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};
