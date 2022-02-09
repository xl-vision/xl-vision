import { env } from '@xl-vision/utils';
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useConstantFn } from '@xl-vision/hooks';
import useTheme from '../ThemeProvider/useTheme';
import { styled } from '../styles';
import usePropChange from '../hooks/usePropChange';

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange' | 'value' | 'defaultValue'
> & {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  onChange?: (value: string) => void;
  value?: string;
  defaultValue?: string;
  showCount?: boolean;
  type?:
    | 'button'
    | 'checkbox'
    | 'color'
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'file'
    | 'hidden'
    | 'image'
    | 'month'
    | 'number'
    | 'password'
    | 'radio'
    | 'range'
    | 'reset'
    | 'search'
    | 'submit'
    | 'tel'
    | 'text'
    | 'time'
    | 'url'
    | 'week';
};

const displayName = 'Input';

const InputRoot = styled('span', {
  name: displayName,
  slot: 'Root',
})(({ theme }) => {
  const { color, shape, transition, typography } = theme;

  return {
    ...typography.body1,
    display: 'inline-block',
    borderRadius: shape.borderRadius.md,
    border: `1px solid ${color.divider}`,
    width: '100%',
    padding: '4px 11px',
    color: color.text.primary,
    backgroundColor: color.background.paper,
    transition: transition.standard('all'),

    '&:hover': {
      borderColor: color.themes.primary.hover,
    },
  };
});

const InputInner = styled('input', {
  name: displayName,
  slot: 'Inner',
})(({ theme }) => {
  const { color, typography, mixins } = theme;
  return {
    ...typography.body1,
    ...mixins.placeholder(),
    display: 'inline-block',
    minWidth: 0,
    width: '100%',
    border: 0,
    outline: 0,
    padding: 0,
    WebkitAppearance: 'none',
    color: color.text.primary,
    backgroundColor: color.background.paper,
  };
});

const Input: React.FunctionComponent<InputProps> = (props) => {
  const {
    className,
    prefix,
    suffix,
    defaultValue = '',
    maxLength,
    showCount,
    value: valueProp,
    onChange,
    ...others
  } = props;

  const { clsPrefix } = useTheme();

  const [value, handlePropChange] = usePropChange(defaultValue, valueProp, onChange);

  const handleChange = useConstantFn((e: React.ChangeEvent<HTMLInputElement>) => {
    handlePropChange(e.target.value);
  });

  const rootClassName = `${clsPrefix}-input`;

  const rootClasses = clsx(rootClassName, className);

  return (
    <InputRoot className={rootClasses}>
      <InputInner
        {...others}
        className={`${rootClassName}__inner`}
        maxLength={maxLength}
        value={value}
        onChange={handleChange}
      />
    </InputRoot>
  );
};

if (!env.isProduction) {
  InputInner.displayName = displayName;
  InputInner.propTypes = {
    className: PropTypes.string,
  };
}

export default Input;
