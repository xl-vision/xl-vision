import { useConstantFn } from '@xl-vision/hooks';
import { useState } from 'react';

const usePropChange = <T>(defaultProp: T, prop: T | undefined, onChange?: (prop: T) => void) => {
  const [value, setValue] = useState<T>(defaultProp);

  const hasProp = typeof prop !== 'undefined';

  const actualValue = hasProp ? prop : value;

  const handleChange = useConstantFn((newValue: T) => {
    if (newValue === actualValue) {
      return;
    }

    if (!hasProp) {
      setValue(newValue);
    }

    onChange?.(newValue);
  });

  return [actualValue, handleChange] as const;
};

export default usePropChange;
