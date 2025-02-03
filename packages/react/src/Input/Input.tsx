import { useConstantFn, useValueChange } from '@xl-vision/hooks';
import { CloseCircleFilled } from '@xl-vision/icons';
import { CSSObject } from '@xl-vision/styled-engine';
import { contains, isProduction } from '@xl-vision/utils';
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
import { styled } from '../styles';
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
})<{ size: SizeVariant; disabled?: boolean; focused?: boolean; readOnly?: boolean }>(({
  theme,
}) => {
  const { typography, sizes } = theme;
  return {
    ...typography.body1.style,
    width: '100%',
    display: 'inline-flex',
    variants: Object.keys(sizes).map((k) => {
      const key = k as SizeVariant;
      const themeSize = sizes[key];
      return {
        props: {
          size: key,
        },
        style: {
          fontSize: typography.pxToRem(typography.body1.info.size * themeSize.fontSize),
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
    borderRightWidth: 0,

    variants: Object.keys(sizes).map((k) => {
      const key = k as SizeVariant;
      const themeSize = sizes[key];
      return {
        props: {
          size: key,
        },
        style: {
          padding: `0 ${themeSize.padding.x}px`,
          border: `${themeSize.border}px solid ${colors.divider.primary}`,
          borderTopLeftRadius: themeSize.borderRadius,
          borderBottomLeftRadius: themeSize.borderRadius,
        },
      };
    }),
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
})<{ focused: boolean; size: SizeVariant; disabled?: boolean; readOnly?: boolean }>(({
  theme,
  styleProps,
}) => {
  const { colors, sizes, transitions } = theme;

  const { focused, size, disabled, readOnly } = styleProps;

  const themeSize = sizes[size];

  return {
    display: 'inline-flex',
    borderRadius: themeSize.borderRadius,
    border: `${themeSize.border}px solid ${colors.divider.primary}`,
    width: '100%',
    padding: `${themeSize.padding.y}px ${themeSize.padding.x}px`,
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
    variants: [{
      props: {
        disabled: true,
      },
      style: {
        opacity: colors.opacity.disabled,
        cursor: 'not-allowed'
      }
    }]
  };

  if (disabled) {
    styles.opacity = colors.opacity.disabled;
    styles.cursor = 'not-allowed';
  } else if (!readOnly) {
    if (focused) {
      styles.borderColor = colors.themes.primary.divider.focus;
      styles.boxShadow = `0 0 0 2px ${colors.themes.primary.outline}`;
    } else {
      styles['&:hover'] = {
        borderColor: colors.themes.primary.divider.hover,
      };
    }
  }

  return styles;
});

const InputInner = styled('input', {
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
})(() => {
  return {
    marginRight: 0,
    marginLeft: 4,
  };
});

const InputSuffixAddon = styled('span', {
  name: displayName,
  slot: 'Addon',
})<{ hasSuffix?: boolean }>(({ theme: { colors }, styleProps: { hasSuffix } }) => {
  return [
    {
      display: 'inline-flex',
      lineHeight: 1,
      alignItems: 'center',
      color: colors.text.hint,
    },
    hasSuffix && {
      marginRight: 4,
    },
  ];
});

const InputSuffixClear = styled(InputSuffixAddon, {
  name: displayName,
  slot: 'Clear',
})(({ theme: { transitions, colors } }) => {
  return {
    cursor: 'pointer',
    transition: transitions.standard('color'),
    '&:hover': {
      color: colors.text.secondary,
    },
  };
});

const Input = forwardRef<InputInstance, InputProps>((props, ref) => {
  const { sizeVariant } = useTheme();

  const {
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
    className,
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

  let showCountNode: ReactNode;

  // 始终按照受控显示
  const { value: actualValue, wordCount } = getWordInfo(value, true);

  if (showCount) {
    const msg = `${wordCount}${hasMaxLength ? `/${maxLength}` : ''}`;

    showCountNode = (
      <InputSuffixAddon styleProps={{ hasSuffix: suffix !== undefined }}>{msg}</InputSuffixAddon>
    );
  }

  let allowClearNode: ReactNode;

  if (!disabled && !readOnly && allowClear && actualValue.length) {
    allowClearNode = (
      <InputSuffixClear
        aria-label='clear'
        role='button'
        styleProps={{ hasSuffix: suffix !== undefined }}
        tabIndex={-1}
        onClick={handleReset}
      >
        <CloseCircleFilled />
      </InputSuffixClear>
    );
  }

  return (
    <InputRoot
      className={className}
      ref={rootRef}
      style={style}
      styleProps={{ size, focused, disabled, readOnly }}
    >
      {addonBefore !== undefined && (
        <InputAddonBefore styleProps={{ size }}>{addonBefore}</InputAddonBefore>
      )}
      <InputWrapper
        styleProps={{ focused, size, disabled, readOnly }}
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
