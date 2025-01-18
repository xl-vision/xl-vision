import { useState } from 'react';
import useConstantFn from '../useConstantFn';

/**
 * When the value is passed in from the outside, the value shall prevail.
 * If not passed in, a value will be generated internally.
 *
 * This hook is mainly used for external values like input, which may or may not be passed.
 * If passed, based on the principle of unidirectional data flow, the internal data state will always be consistent with the external value.
 * If not passed, a data state needs to be maintained internally in response to user input
 * @param defaultValue The default value, when the value does not exist, it will be used as the initial value
 * @param value actual value
 * @param onChange After the internal data changes, synchronize the data changes to the outside
 * @returns
 */
const useValueChange = <T>(
  defaultValue: T,
  value: T | undefined,
  onChange?: (value: T) => void,
) => {
  const [internalValue, setInternalValue] = useState<T>(defaultValue);

  const hasValue = value !== undefined;

  const actualValue = hasValue ? value : internalValue;

  const handleChange = useConstantFn((newValue: T | ((v: T) => T)) => {
    const v = typeof newValue === 'function' ? (newValue as (v: T) => T)(actualValue) : newValue;

    if (v === actualValue) {
      return;
    }

    if (!hasValue) {
      setInternalValue(v);
    }

    onChange?.(v);
  });

  return [actualValue, handleChange] as const;
};

export default useValueChange;
