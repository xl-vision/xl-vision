import { env } from '@xl-vision/utils';
import React, { ReactNode } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useConstantFn } from '@xl-vision/hooks';
import useTheme from '../ThemeProvider/useTheme';
import { styled } from '../styles';
import usePropChange from '../hooks/usePropChange';

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange' | 'value' | 'defaultValue' | 'prefix'
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
    display: 'inline-flex',
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
    touchAction: 'manipulation',
    fontVariant: 'tabular-nums',
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

const InputPrefix = styled('span', {
  name: displayName,
  slot: 'Prefix',
})(({ theme }) => {
  const { color } = theme;

  return {
    display: 'flex',
    flex: 'none',
    alignItems: 'center',
    color: color.text.hint,
    marginRight: 4,
  };
});

const InputSuffix = styled(InputPrefix, {
  name: displayName,
  slot: 'Suffix',
})(() => {
  return {
    marginRight: 0,
    marginLeft: 4,
  };
});

const Input = React.forwardRef<HTMLSpanElement, InputProps>((props, ref) => {
  const {
    className,
    prefix,
    suffix,
    defaultValue = '',
    maxLength,
    showCount,
    value: valueProp,
    onChange,
    type = 'text',
    ...others
  } = props;

  const { clsPrefix } = useTheme();

  const [value, handlePropChange] = usePropChange(defaultValue, valueProp, onChange);

  const [focused, setFocused] = React.useState(false);

  const handleChange = useConstantFn((e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value;
    if (typeof v === 'undefined' || v === null) {
      v = '';
    }

    handlePropChange(v);
  });

  const rootClassName = `${clsPrefix}-input`;

  const rootClasses = clsx(rootClassName, className);

  let suffixInner: ReactNode;

  if (showCount) {
    const { length } = value;
    const msg = `${length}${maxLength ? `/${maxLength}` : ''}`;
    suffixInner = msg;
  } else {
    suffixInner = suffix;
  }

  return (
    <InputRoot className={rootClasses} ref={ref} onFocus={() => {console.log(1)}}>
      {typeof prefix !== 'undefined' && (
        <InputPrefix className={`${rootClassName}__prefix`}>{prefix}</InputPrefix>
      )}
      <InputInner
        {...others}
        type={type}
        className={`${rootClassName}__inner`}
        maxLength={maxLength}
        value={value}
        onChange={handleChange}
      />
      {typeof suffixInner !== 'undefined' && (
        <InputSuffix className={`${rootClassName}__suffix`}>{suffixInner}</InputSuffix>
      )}
    </InputRoot>
  );
});

if (!env.isProduction) {
  Input.displayName = displayName;
  Input.propTypes = {
    className: PropTypes.string,
  };
}

export default Input;
