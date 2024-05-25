import { isProduction } from '@xl-vision/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

export type InputNumberProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange' | 'value' | 'defaultValue' | 'prefix' | 'size'
> & {};

const displayName = 'InputNumber';

const InputNumber = forwardRef<HTMLSpanElement, InputNumberProps>((props, ref) => {
  return <span />;
});

if (!isProduction) {
  InputNumber.displayName = displayName;
  InputNumber.propTypes = {};
}

export default InputNumber;
