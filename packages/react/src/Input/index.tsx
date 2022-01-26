import { env } from '@xl-vision/utils';
import React from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const displayName = 'Button';

const Input: React.FunctionComponent<InputProps> = (props) => {
  return <input />;
};

if (!env.isProduction) {
  Input.displayName = displayName;
  Input.propTypes = {};
}

export default Input;
