import { useConstantFn } from '@xl-vision/hooks';
import { useState } from 'react';

const usePropChange = <T>(
  defaultProp: T,
  prop: T | undefined,
  onChange: ((prop: T) => void) | undefined,
) => {
  const [value, setValue] = useState<T>(defaultProp);

  const hasProp = typeof prop !== 'undefined';

  const handleChange = useConstantFn((newValue: T) => {
    if (newValue === value) {
      return;
    }
    if (!hasProp) {
      setValue(newValue);
    }
    onChange?.(newValue);
  });

  const actualValue = hasProp ? prop : value;

  return [actualValue, handleChange] as const;
};

export default usePropChange;
