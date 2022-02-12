import { env } from '@xl-vision/utils';
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useConstantFn, useForkRef, useUnmount } from '@xl-vision/hooks';
import { CSSObject } from '@xl-vision/styled-engine';
import useTheme from '../ThemeProvider/useTheme';
import { styled } from '../styles';
import usePropChange from '../hooks/usePropChange';
import { contains } from '../utils/dom';
import { alpha } from '../utils/color';

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange' | 'value' | 'defaultValue' | 'prefix'
> & {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  addonAfter?: React.ReactNode;
  addonBefore?: React.ReactNode;
  onChange?: (value: string) => void;
  value?: string;
  defaultValue?: string;
  showCount?: boolean;
  allowClear?: boolean;
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
  const { typography } = theme;

  return {
    ...typography.body1,
    width: '100%',
    display: 'inline-flex',
  };
});

const InputAddonBefore = styled('span', {
  name: displayName,
  slot: 'AddonBefore',
})(({ theme }) => {
  const { color, shape } = theme;

  return {
    display: 'flex',
    flex: 'none',
    alignItems: 'center',
    backgroundColor: color.emphasize(color.background.paper, 0.05),
    padding: '0 8px',
    border: `1px solid ${color.divider}`,
    borderRightWidth: 0,
    borderTopLeftRadius: shape.borderRadius.md,
    borderBottomLeftRadius: shape.borderRadius.md,
  };
});

const InputAddonAfter = styled(InputAddonBefore, {
  name: displayName,
  slot: 'AddonAfter',
})(({ theme }) => {
  const { shape } = theme;
  return {
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: shape.borderRadius.md,
    borderBottomRightRadius: shape.borderRadius.md,
  };
});

const InputWrapper = styled('span', {
  name: displayName,
  slot: 'Wrapper',
})<{ focused: boolean }>(({ theme, styleProps }) => {
  const { color, shape, transition } = theme;

  const { focused } = styleProps;

  const focusColor = color.themes.primary.focus;

  const focusedStyle: CSSObject = {
    borderColor: focusColor,
    boxShadow: `0 0 0 2px ${alpha(focusColor, 0.2)}`,
  };

  return {
    display: 'inline-flex',
    borderRadius: shape.borderRadius.md,
    border: `1px solid ${color.divider}`,
    width: '100%',
    padding: '4px 11px',
    color: color.text.primary,
    backgroundColor: color.background.paper,
    transition: transition.standard(['borderColor', 'boxShadow']),
    zIndex: 1,

    '&:not(:first-child)': {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    },
    '&:not(:last-child)': {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },

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
  const { color, typography, mixins, transition } = theme;
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
    transition: transition.standard(['borderColor', 'boxShadow']),
  };
});

const InputPrefix = styled('span', {
  name: displayName,
  slot: 'Prefix',
})(() => {
  return {
    display: 'flex',
    flex: 'none',
    alignItems: 'center',
    marginRight: 4,
  };
});

const InputSuffix = styled(InputPrefix, {
  name: displayName,
  slot: 'Suffix',
})(({ theme }) => {
  const { clsPrefix, color } = theme;
  return {
    marginRight: 0,
    marginLeft: 4,
    [`.${clsPrefix}-input__suffix-count`]: {
      color: color.text.hint,
    },
  };
});

const Input = React.forwardRef<HTMLSpanElement, InputProps>((props, ref) => {
  const {
    className,
    style,
    prefix,
    suffix,
    addonBefore,
    addonAfter,
    defaultValue = '',
    maxLength,
    showCount,
    allowClear,
    value: valueProp,
    onChange,
    type = 'text',
    onBlur,
    onFocus,
    ...others
  } = props;

  const { clsPrefix } = useTheme();

  const [value, handlePropChange] = usePropChange(defaultValue, valueProp, onChange);

  const [focused, setFocused] = React.useState(false);

  const rootRef = React.useRef<HTMLSpanElement>(null);

  const forkRef = useForkRef(rootRef, ref);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const removePasswordTimerRef = React.useRef<NodeJS.Timeout>();

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

  const handleFocus = useConstantFn((e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.(e);
  });

  const handleBlur = useConstantFn((e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(e);
  });

  // 将input focus绑定到span上
  React.useEffect(() => {
    if (rootRef.current) {
      rootRef.current.focus = focus;
    }
  }, [focus]);

  // 检测是否type=password,并删除value，避免密码泄露
  React.useEffect(() => {
    removePasswordTimerRef.current = setTimeout(() => {
      const input = inputRef.current;
      if (input && input.getAttribute('type') === 'password' && input.hasAttribute('value')) {
        input.removeAttribute('value');
      }
    });
  });

  useUnmount(() => {
    const timer = removePasswordTimerRef.current;
    if (timer) {
      clearTimeout(timer);
    }
  });

  const rootClassName = `${clsPrefix}-input`;

  const rootClasses = clsx(
    rootClassName,
    {
      [`${rootClassName}--focused`]: focused,
    },
    className,
  );

  let suffixInner: React.ReactNode;

  if (suffix || showCount || (allowClear && value.length)) {
    suffixInner = <>{allowClear && value.length && <span></span>}</>;
  }

  if (showCount) {
    const { length } = value;
    const msg = `${length}${maxLength ? `/${maxLength}` : ''}`;
    suffixInner = <span className={`${rootClassName}__suffix-count`}>{msg}</span>;
  } else {
    suffixInner = suffix;
  }

  return (
    <InputRoot style={style} className={rootClasses} ref={forkRef}>
      {typeof addonBefore !== 'undefined' && <InputAddonBefore>{addonBefore}</InputAddonBefore>}
      <InputWrapper
        className={`${rootClassName}__wrapper`}
        styleProps={{ focused }}
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
      </InputWrapper>
      {typeof addonAfter !== 'undefined' && <InputAddonAfter>{addonAfter}</InputAddonAfter>}
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
