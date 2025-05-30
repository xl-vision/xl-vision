import { useConstantFn, useValueChange } from '@xl-vision/hooks';
import { CloseCircleFilled } from '@xl-vision/icons';
import { contains, isProduction } from '@xl-vision/utils';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  InputHTMLAttributes,
  ReactNode,
  forwardRef,
  useState,
  useRef,
  ChangeEvent,
  useEffect,
  MouseEvent,
  useImperativeHandle,
} from 'react';
import useInput from '../hooks/useInput';
import memoStyled from '../memoStyled';
import { SizeVariant, useTheme } from '../ThemeProvider';
import { RefInstance } from '../types';

export type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange' | 'value' | 'defaultValue' | 'prefix' | 'size'
> & {
  prefix?: ReactNode;
  suffix?: ReactNode;
  addonAfter?: ReactNode;
  addonBefore?: ReactNode;
  onChange?: (value: string) => void;
  value?: string;
  defaultValue?: string;
  showCount?: boolean;
  allowClear?: boolean;
  size?: SizeVariant;
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

export type InputInstance = RefInstance<
  HTMLSpanElement,
  {
    focus: () => void;
  }
>;

const displayName = 'Input';

const InputRoot = memoStyled('span', {
  name: displayName,
  slot: 'Root',
})<{ size: SizeVariant }>(({ theme }) => {
  const { typography, sizes } = theme;

  return {
    ...typography.body1.style,
    width: '100%',
    display: 'inline-flex',
    variants: Object.keys(sizes).map((k) => {
      const sizeKey = k as SizeVariant;
      return {
        props: {
          size: sizeKey,
        },
        style: {
          fontSize: typography.pxToRem(typography.body1.info.size * sizes[sizeKey].fontSize),
        },
      };
    }),
  };
});

const InputAddonBefore = memoStyled('span', {
  name: displayName,
  slot: 'AddonBefore',
})<{ size: SizeVariant }>(({ theme }) => {
  const { colors, sizes } = theme;

  return {
    display: 'flex',
    flex: 'none',
    alignItems: 'center',
    backgroundColor: colors.background.default,
    variants: [
      ...Object.keys(sizes).map((k) => {
        const sizeKey = k as SizeVariant;
        const themeSize = sizes[sizeKey];
        return {
          props: {
            size: sizeKey,
          },
          style: {
            borderTopLeftRadius: themeSize.borderRadius,
            borderBottomLeftRadius: themeSize.borderRadius,
            padding: `0 ${themeSize.padding.x}px`,
            border: `${themeSize.border}px solid ${colors.divider.primary}`,
          },
        };
      }),
      {
        style: {
          borderRightWidth: 0,
        },
      },
    ],
  };
});

const InputAddonAfter = memoStyled(InputAddonBefore, {
  name: displayName,
  slot: 'AddonAfter',
})(({ theme }) => {
  const { sizes } = theme;
  return {
    borderLeftWidth: 0,
    borderRightWidth: sizes.middle.border,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: sizes.middle.borderRadius,
    borderBottomRightRadius: sizes.middle.borderRadius,
  };
});

const InputWrapper = memoStyled('span', {
  name: displayName,
  slot: 'Wrapper',
})<{ focused: boolean; size: SizeVariant; disabled: boolean; readOnly: boolean }>(({ theme }) => {
  const { colors, sizes, transitions } = theme;

  return {
    display: 'inline-flex',
    width: '100%',
    color: colors.text.primary,
    backgroundColor: colors.background.paper,
    transition: transitions.standard(['borderColor', 'boxShadow']),
    zIndex: 1,
    fontSize: 'inherit',
    '&:not(:first-child)': {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    },
    '&:not(:last-child)': {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
    variants: [
      ...Object.keys(sizes).map((k) => {
        const sizeKey = k as SizeVariant;
        const themeSize = sizes[sizeKey];
        return {
          props: {
            size: sizeKey,
          },
          style: {
            borderRadius: themeSize.borderRadius,
            border: `${themeSize.border}px solid ${colors.divider.primary}`,
            padding: `${themeSize.padding.y}px ${themeSize.padding.x}px`,
          },
        };
      }),
      {
        props: {
          disabled: true,
        },
        style: {
          opacity: colors.opacity.disabled,
          cursor: 'not-allowed',
        },
      },
      {
        props: {
          disabled: false,
          readOnly: false,
        },
        style: {},
        variants: [
          {
            props: {
              focused: true,
            },
            style: {
              borderColor: colors.themes.primary.divider.focus,
              boxShadow: `0 0 0 2px ${colors.themes.primary.outline}`,
            },
          },
          {
            props: {
              focused: false,
            },
            style: {
              ['&:hover']: {
                borderColor: colors.themes.primary.divider.hover,
              },
            },
          },
        ],
      },
    ],
  };
});

const InputInner = memoStyled('input', {
  name: displayName,
  slot: 'Inner',
})(({ theme }) => {
  const { colors, typography, mixins, transitions } = theme;
  return {
    ...mixins.placeholder(),
    ...typography.body1.style,
    cursor: 'inherit',
    fontSize: 'inherit',
    touchAction: 'manipulation',
    fontVariant: 'tabular-nums',
    display: 'inline-block',
    minWidth: 0,
    width: '100%',
    border: 0,
    outline: 0,
    padding: 0,
    WebkitAppearance: 'none',
    color: colors.text.primary,
    backgroundColor: colors.background.paper,
    transition: transitions.standard(['borderColor', 'boxShadow']),
  };
});

const InputPrefix = memoStyled('span', {
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

const InputSuffix = memoStyled(InputPrefix, {
  name: displayName,
  slot: 'Suffix',
})(({ theme }) => {
  const { colors, transitions, clsPrefix } = theme;
  return {
    marginRight: 0,
    marginLeft: 4,
    [`.${clsPrefix}-input__suffix--has-suffix`]: {
      marginRight: 4,
    },
    [`.${clsPrefix}-input__suffix-count, .${clsPrefix}-input__suffix-clear`]: {
      display: 'inline-flex',
      lineHeight: 1,
      alignItems: 'center',
      color: colors.text.hint,
    },
    [`.${clsPrefix}-input__suffix-clear`]: {
      cursor: 'pointer',
      transition: transitions.standard('color'),
      '&:hover': {
        color: colors.text.secondary,
      },
    },
  };
});

const Input = forwardRef<InputInstance, InputProps>((props, ref) => {
  const { clsPrefix, sizeVariant } = useTheme();

  const {
    className,
    style,
    size = sizeVariant,
    prefix,
    suffix,
    addonBefore,
    addonAfter,
    defaultValue = '',
    value: valueProp,
    maxLength,
    disabled,
    readOnly,
    showCount,
    allowClear,
    type = 'text',
    onChange,
    ...others
  } = props;

  const [value, handleValueChange] = useValueChange(defaultValue, valueProp, onChange);

  const {
    hasMaxLength,
    ref: inputRef,
    getWordInfo,
  } = useInput<HTMLInputElement>({ setValue: handleValueChange, maxLength });

  const [focused, setFocused] = useState(false);

  const focusTimeoutRef = useRef<number>(null);

  const removePasswordTimerRef = useRef<NodeJS.Timeout>(null);

  const rootRef = useRef<HTMLSpanElement>(null);

  const focus = useConstantFn(() => {
    if (!disabled && !readOnly) {
      inputRef.current?.focus();
    }
  });

  useImperativeHandle(ref, () => {
    return {
      focus,
      get nativeElement() {
        return rootRef.current;
      },
    };
  }, [focus]);

  const handleChange = useConstantFn((e: ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value;
    if (v === undefined || v === null) {
      v = '';
    }

    v = getWordInfo(v).value;

    handleValueChange(v);
  });

  const handleMouseUp = useConstantFn((e: MouseEvent) => {
    const el = rootRef.current;
    if (!el) {
      return;
    }
    if (contains(el, e.target as Element)) {
      focus();
    }
  });

  const handleFocus = useConstantFn(() => {
    const timer = focusTimeoutRef.current;
    if (timer) {
      clearTimeout(timer);
    }
    if (!disabled && !readOnly) {
      setFocused(true);
    }
  });

  const handleBlur = useConstantFn(() => {
    focusTimeoutRef.current = window.setTimeout(() => {
      setFocused(false);
    }, 200);
  });

  const handleReset = useConstantFn(() => {
    handleValueChange('');
  });

  // 将input focus绑定到span上
  useEffect(() => {
    if (rootRef.current) {
      rootRef.current.focus = focus;
    }
  }, [focus]);

  useEffect(() => {
    if (disabled || readOnly) {
      setFocused(false);
    }
  }, [disabled, readOnly]);

  // 检测是否type=password,并删除value，避免密码泄露
  useEffect(() => {
    removePasswordTimerRef.current = setTimeout(() => {
      const input = inputRef.current;
      if (input && input.getAttribute('type') === 'password' && input.hasAttribute('value')) {
        input.removeAttribute('value');
      }
    });
  });

  useEffect(() => {
    return () => {
      const timer = removePasswordTimerRef.current;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  const rootClassName = `${clsPrefix}-input`;

  const rootClasses = clsx(
    `${rootClassName}--size-${size}`,
    {
      [`${rootClassName}--focused`]: focused,
      [`${rootClassName}--disabled`]: disabled,
      [`${rootClassName}--readonly`]: readOnly,
    },
    className,
  );

  let showCountNode: ReactNode;

  // 始终按照受控显示
  const { value: actualValue, wordCount } = getWordInfo(value, true);

  if (showCount) {
    const msg = `${wordCount}${hasMaxLength ? `/${maxLength}` : ''}`;

    const countClasses = clsx(`${rootClassName}__suffix-count`, {
      [`${rootClassName}__suffix--has-suffix`]: suffix !== undefined,
    });

    showCountNode = <span className={countClasses}>{msg}</span>;
  }

  let allowClearNode: ReactNode;

  if (!disabled && !readOnly && allowClear && actualValue.length) {
    const clearClasses = clsx(`${rootClassName}__suffix-clear`, {
      [`${rootClassName}__suffix--has-suffix`]: showCountNode,
    });

    allowClearNode = (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events
      <span
        aria-label='clear'
        className={clearClasses}
        role='button'
        tabIndex={-1}
        onClick={handleReset}
      >
        <CloseCircleFilled />
      </span>
    );
  }

  return (
    <InputRoot className={rootClasses} ref={rootRef} style={style} styleProps={{ size }}>
      {addonBefore !== undefined && (
        <InputAddonBefore styleProps={{ size }}>{addonBefore}</InputAddonBefore>
      )}
      <InputWrapper
        styleProps={{ focused, size, disabled: !!disabled, readOnly: !!readOnly }}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onMouseUp={handleMouseUp}
      >
        {prefix !== undefined && <InputPrefix>{prefix}</InputPrefix>}
        <InputInner
          aria-disabled={disabled}
          aria-readonly={readOnly}
          {...others}
          disabled={disabled}
          readOnly={readOnly}
          ref={inputRef}
          type={type}
          value={actualValue}
          onChange={handleChange}
        />
        {(allowClearNode || showCountNode || suffix !== undefined) && (
          <InputSuffix>
            {allowClearNode}
            {showCountNode}
            {suffix}
          </InputSuffix>
        )}
      </InputWrapper>
      {addonAfter !== undefined && (
        <InputAddonAfter styleProps={{ size }}>{addonAfter}</InputAddonAfter>
      )}
    </InputRoot>
  );
});

if (!isProduction) {
  Input.displayName = displayName;
  Input.propTypes = {
    addonAfter: PropTypes.node,
    addonBefore: PropTypes.node,
    allowClear: PropTypes.bool,
    className: PropTypes.string,
    defaultValue: PropTypes.string,
    disabled: PropTypes.bool,
    maxLength: PropTypes.number,
    prefix: PropTypes.node,
    readOnly: PropTypes.bool,
    showCount: PropTypes.bool,
    size: PropTypes.oneOf<SizeVariant>(['large', 'middle', 'small']),
    style: PropTypes.shape({}),
    suffix: PropTypes.node,
    type: PropTypes.oneOf([
      'button',
      'checkbox',
      'color',
      'date',
      'datetime-local',
      'email',
      'file',
      'hidden',
      'image',
      'month',
      'number',
      'password',
      'radio',
      'range',
      'reset',
      'search',
      'submit',
      'tel',
      'text',
      'time',
      'url',
      'week',
    ]),
    value: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
  };
}

export default Input;
