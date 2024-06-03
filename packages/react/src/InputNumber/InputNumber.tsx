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

  const handledFormatter = useConstantFn((v: InputNumberValueType) => {
    if (formatter) {
      return formatter(v);
    }
    if (v === null) {
      return '';
    }
    return String(v);
  });

  useEffect(() => {
    handleInternalValue(handledFormatter(value));
  }, [value, handledFormatter]);

  const updateValue = useConstantFn(() => {
    let v: InputNumberValueType | undefined;
    if (parser) {
      v = parser(internalValue);
    } else {
      const trimedValue = internalValue.trim();
      if (!trimedValue) {
        v = null;
      } else if (NUMBER_REGEX.test(trimedValue)) {
        v = Number(trimedValue);
      }
    }

    if (v === undefined) {
      return;
    }

    if (v === null) {
      setValue(null);
      return;
    }

    if ((max !== undefined && v > max) || (min !== undefined && v < min)) {
      return;
    }
    setValue(v);
  });

  const handleBlur: FocusEventHandler<HTMLInputElement> = useConstantFn((e) => {
    onBlur?.(e);
    updateValue();
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
