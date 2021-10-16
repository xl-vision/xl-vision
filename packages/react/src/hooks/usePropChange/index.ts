import React from 'react';
import { useConstantFn } from '@xl-vision/hooks';

export default <T>(
  defaultProp: T,
  prop: T | undefined,
  onChange: ((prop: T) => void) | undefined,
  prePropChangeHandler?: (prop: T) => void,
) => {
  const [value, setValue] = React.useState<T>(() => {
    if (prop !== undefined) {
      return prop;
    }
    return defaultProp;
  });

  const handleChange = useConstantFn((newValue: T) => {
    if (prop === undefined) {
      setValue(newValue);
    }
    if (newValue !== value) {
      onChange?.(newValue);
    }
  });

  const prePropChangeHandlerWrapper = useConstantFn((_prop: T) => {
    prePropChangeHandler?.(_prop);
    setValue(_prop);
  });

  React.useEffect(() => {
    if (prop !== undefined) {
      prePropChangeHandlerWrapper(prop);
    }
  }, [prop, prePropChangeHandlerWrapper]);

  return [value, handleChange] as const;
};
