import { useConstantFn, useValueChange } from '@xl-vision/hooks';
import { isProduction } from '@xl-vision/utils';
import { InputHTMLAttributes, forwardRef, useCallback, useState } from 'react';
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
const NUMBER_DECIMAL_START = /^-?\d+\.$/;

const InputNumber = forwardRef<HTMLSpanElement, InputNumberProps>((props, ref) => {
  const { onChange, value: valueProp, defaultValue = null, min, max, parser, formatter } = props;

  const [value, handleValueChange] = useValueChange(defaultValue, valueProp, onChange);
  const [isDecimal, setDecimal] = useState(false);

  const handleChange = useConstantFn((newValue: string) => {
    setDecimal(false);
    let v: InputNumberValueType | undefined;
    if (parser) {
      v = parser(newValue);
    } else {
      const trimedValue = newValue.trim();
      if (!trimedValue) {
        v = null;
      } else {
        const isDecimalStart = NUMBER_DECIMAL_START.test(trimedValue);
        if (isDecimalStart) {
          setDecimal(true);
        }
        if (isDecimalStart || NUMBER_REGEX.test(trimedValue)) {
          v = Number(trimedValue);
        }
      }
    }

    if (v === undefined) {
      return;
    }

    if (v === null) {
      handleValueChange(null);
      return;
    }

    if ((max !== undefined && v > max) || (min !== undefined && v < min)) {
      return;
    }
    handleValueChange(v);
  });

  const handledFormatter = useConstantFn((v: InputNumberValueType) => {
    const suffix = isDecimal ? '.' : '';

    if (formatter) {
      return formatter(v) + suffix;
    }
    if (v === null) {
      return '';
    }
    return String(v) + suffix;
  });

  return <InputNumberRoot ref={ref} value={handledFormatter(value)} onChange={handleChange} />;
});

if (!isProduction) {
  InputNumber.displayName = displayName;
  InputNumber.propTypes = {};
}

export default InputNumber;
