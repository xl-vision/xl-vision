import { env } from '@xl-vision/utils';
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import useTheme from '../ThemeProvider/useTheme';
import { styled } from '../styles';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const displayName = 'Input';

const Root = styled('input', {
  name: displayName,
  slot: 'Root',
})(({ theme }) => {
  const { color, shape, typography } = theme;

  return {
    ...typography.body1,
    outline: 0,
    borderRadius: shape.borderRadius.md,
    border: `1px solid ${color.divider}`,
    WebkitAppearance: 'none',
    color: color.text.primary,
    width: '100%',
    minWidth: 0,
    padding: '4px 11px',
  };
});

const Input: React.FunctionComponent<InputProps> = (props) => {
  const { className, ...others } = props;

  const { clsPrefix } = useTheme();

  const rootClassName = `${clsPrefix}-input`;

  const rootClasses = clsx(rootClassName, className);

  return <Root {...others} className={rootClasses} />;
};

if (!env.isProduction) {
  Input.displayName = displayName;
  Input.propTypes = {
    className: PropTypes.string,
  };
}

export default Input;
