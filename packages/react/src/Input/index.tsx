import { env } from '@xl-vision/utils';
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useConstantFn, useForkRef } from '@xl-vision/hooks';
import { CSSObject } from '@xl-vision/styled-engine';
import useTheme from '../ThemeProvider/useTheme';
import { styled } from '../styles';
import usePropChange from '../hooks/usePropChange';
import { contains } from '../utils/dom';

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
})<{ focused: boolean }>(({ theme, styleProps }) => {
  const { color, shape, transition, typography } = theme;

  const { focused } = styleProps;

  const focusColor = color.themes.primary.focus;

  const focusedStyle: CSSObject = {
    borderColor: focusColor,
    boxShadow: `0 0 2px ${focusColor}`,
  };

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

    ...(focused && focusedStyle),
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

  const rootRef = React.useRef<HTMLSpanElement>(null);

  const forkRef = useForkRef(rootRef, ref);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = useConstantFn((e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value;
    if (typeof v === 'undefined' || v === null) {
      v = '';
    }

    handlePropChange(v);
  });

  const focus = React.useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const handleMouseUp = useConstantFn((e: React.MouseEvent) => {
    const el = rootRef.current;
    if (!el) {
      return;
    }
    if (contains(el, e.target as Element)) {
      focus();
    }
  });

  const handleFocus = React.useCallback(() => {
    setFocused(true);
  }, []);

  const handleBlur = React.useCallback(() => {
    setFocused(false);
  }, []);

  // 将input focus绑定到span上
  React.useEffect(() => {
    if (rootRef.current) {
      rootRef.current.focus = focus;
    }
  }, [focus]);

  const rootClassName = `${clsPrefix}-input`;

  const rootClasses = clsx(
    rootClassName,
    {
      [`${rootClassName}--focused`]: focused,
    },
    className,
  );

  let suffixInner: React.ReactNode;

  if (showCount) {
    const { length } = value;
    const msg = `${length}${maxLength ? `/${maxLength}` : ''}`;
    suffixInner = msg;
  } else {
    suffixInner = suffix;
  }

  return (
    <InputRoot
      styleProps={{ focused }}
      className={rootClasses}
      ref={forkRef}
      onMouseUp={handleMouseUp}
    >
      {typeof prefix !== 'undefined' && (
        <InputPrefix className={`${rootClassName}__prefix`}>{prefix}</InputPrefix>
      )}
      <InputInner
        {...others}
        ref={inputRef}
        onFocus={handleFocus}
        onBlur={handleBlur}
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
