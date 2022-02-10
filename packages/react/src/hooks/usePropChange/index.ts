import React from 'react';
import { useConstantFn } from '@xl-vision/hooks';

const usePropChange = <T>(
  defaultProp: T,
  prop: T | undefined,
  onChange: ((prop: T) => void) | undefined,
) => {
  const [value, setValue] = React.useState<T>(defaultProp);

  const hasProp = typeof prop !== 'undefined';

  const handleChange = useConstantFn((newValue: T) => {
    if (newValue !== value) {
      if (!hasProp) {
        setValue(newValue);
      }
      onChange?.(newValue);
    }
  });

  const actualValue = hasProp ? prop : value;

  return [actualValue, handleChange] as const;
};

export default usePropChange;
