import React from 'react';
import { useEventCallback } from '@xl-vision/hooks';

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

  const handleChange = useEventCallback((newValue: T) => {
    if (prop === undefined) {
      setValue(newValue);
    }
    if (newValue !== value) {
      onChange?.(newValue);
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const prePropChangeHandlerWrapper = useEventCallback((prop: T) => {
    prePropChangeHandler?.(prop);
    setValue(prop);
  });

  React.useEffect(() => {
    if (prop !== undefined) {
      prePropChangeHandlerWrapper(prop);
    }
  }, [prop, prePropChangeHandlerWrapper]);

  return [value, handleChange] as const;
};
