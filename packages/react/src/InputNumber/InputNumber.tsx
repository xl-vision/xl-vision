import { useConstantFn, useValueChange } from '@xl-vision/hooks';
import { isProduction } from '@xl-vision/utils';
import { InputHTMLAttributes, forwardRef, useState, FocusEventHandler, useEffect } from 'react';
import { Input } from '../Input';
import { styled } from '../styles';

export type InputNumberValueType = number | null;

export type InputNumberProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange' | 'value' | 'defaultValue' | 'prefix' | 'size'
> & {
  onChange?: (value: InputNumberValueType) => void;
  value?: InputNumberValueType;
  defaultValue?: InputNumberValueType;
  min?: number;
  max?: number;
  parser?: (value: string) => InputNumberValueType;
  formatter?: (value: InputNumberValueType) => string;
};

const displayName = 'InputNumber';

const InputNumberRoot = styled(Input, {
  name: displayName,
  slot: 'Root',
})(() => {
  return {};
});

const NUMBER_REGEX = /^-?\d+(\.\d+)?$/;

const InputNumber = forwardRef<HTMLSpanElement, InputNumberProps>((props, ref) => {
  const {
    onChange,
    value: valueProp,
    defaultValue = null,
    min,
    max,
    parser,
    formatter,
    onBlur,
  } = props;

  const [value, setValue] = useValueChange(defaultValue, valueProp, onChange);

  const [internalValue, handleInternalValue] = useState('');

  const handleFormatter = useConstantFn((v: InputNumberValueType) => {
    if (formatter) {
      return formatter(v);
    }
    if (v === null) {
      return '';
    }
    return String(v);
  });

  const defaultParser = useConstantFn((str: string) => {
    // eslint-disable-next-line react/destructuring-assignment
    const trimedValue = str.trim();
    if (!trimedValue) {
      return null;
    }
    if (NUMBER_REGEX.test(trimedValue)) {
      return Number(trimedValue);
    }
    return value;
  });

  const handleParser = useConstantFn((str: string) => {
    if (parser) {
      const parseredValue = parser(str);

      if (typeof parseredValue === 'string') {
        return defaultParser(parseredValue);
      }

      if (parseredValue !== null && typeof parseredValue !== 'number') {
        return value;
      }
      return parseredValue;
    }

    const trimedValue = str.trim();
    if (!trimedValue) {
      return null;
    }

    if (NUMBER_REGEX.test(trimedValue)) {
      return Number(trimedValue);
    }

    return value;
  });

  useEffect(() => {
    handleInternalValue(handleFormatter(value));
  }, [value, handleFormatter]);

  const handleBlur: FocusEventHandler<HTMLInputElement> = useConstantFn((e) => {
    onBlur?.(e);
    let v = handleParser(internalValue);

    if (v !== null) {
      if (max !== undefined && v > max) {
        v = value;
      } else if (min !== undefined && v < min) {
        v = value;
      }
    }

    setValue(v);
    handleInternalValue(handleFormatter(v));
  });

  return (
    <InputNumberRoot
      ref={ref}
      value={internalValue}
      onBlur={handleBlur}
      onChange={handleInternalValue}
    />
  );
});

if (!isProduction) {
  InputNumber.displayName = displayName;
  InputNumber.propTypes = {};
}

export default InputNumber;
