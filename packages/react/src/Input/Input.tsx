import { env } from '@xl-vision/utils';
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useConstantFn, useForkRef, useUnmount } from '@xl-vision/hooks';
import { CloseCircleFilled } from '@xl-vision/icons';
import { CSSObject } from '@xl-vision/styled-engine';
import { styled } from '../styles';
import usePropChange from '../hooks/usePropChange';
import { contains } from '../utils/dom';
import { alpha } from '../utils/color';
import { ComponentSize, useTheme } from '../ThemeProvider';

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange' | 'value' | 'defaultValue' | 'prefix' | 'size'
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
  size?: ComponentSize;
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
})<{ size: ComponentSize }>(({ theme, styleProps }) => {
  const { typography, styleSize } = theme;
  const { size } = styleProps;

  const themeSize = styleSize[size];

  return {
    ...typography.body1.style,
    width: '100%',
    display: 'inline-flex',
    fontSize: typography.pxToRem(typography.body1.info.size * themeSize.fontSize),
  };
});

const InputAddonBefore = styled('span', {
  name: displayName,
  slot: 'AddonBefore',
})<{ size: ComponentSize }>(({ theme, styleProps }) => {
  const { color, styleSize } = theme;

  const { size } = styleProps;

  const themeSize = styleSize[size];

  return {
    display: 'flex',
    flex: 'none',
    alignItems: 'center',
    backgroundColor: color.emphasize(color.background.paper, 0.05),
    padding: `0 ${themeSize.padding.x}px`,
    border: `${themeSize.border}px solid ${color.divider}`,
    borderRightWidth: 0,
    borderTopLeftRadius: themeSize.borderRadius,
    borderBottomLeftRadius: themeSize.borderRadius,
  };
});

const InputAddonAfter = styled(InputAddonBefore, {
  name: displayName,
  slot: 'AddonAfter',
})(({ theme }) => {
  const { styleSize } = theme;
  return {
    borderLeftWidth: 0,
    borderRightWidth: styleSize.middle.border,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: styleSize.middle.borderRadius,
    borderBottomRightRadius: styleSize.middle.borderRadius,
  };
});

const InputWrapper = styled('span', {
  name: displayName,
  slot: 'Wrapper',
})<{ focused: boolean; size: ComponentSize; disabled?: boolean; readOnly?: boolean }>(
  ({ theme, styleProps }) => {
    const { color, styleSize, transition } = theme;

    const { focused, size, disabled, readOnly } = styleProps;

    const themeSize = styleSize[size];

    const styles: CSSObject = {
      display: 'inline-flex',
      borderRadius: themeSize.borderRadius,
      border: `${themeSize.border}px solid ${color.divider}`,
      width: '100%',
      padding: `${themeSize.padding.y}px ${themeSize.padding.x}px`,
      color: color.text.primary,
      backgroundColor: color.background.paper,
      transition: transition.standard(['borderColor', 'boxShadow']),
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
    };

    if (disabled) {
      styles.opacity = color.action.disabled;
      styles.cursor = 'not-allowed';
    } else if (!readOnly) {
      if (focused) {
        const focusColor = color.themes.primary.focus;
        styles.borderColor = focusColor;
        styles.boxShadow = `0 0 0 2px ${alpha(focusColor, 0.2)}`;
      } else {
        styles['&:hover'] = {
          borderColor: color.themes.primary.hover,
        };
      }
    }

    return styles;
  },
);

const InputInner = styled('input', {
  name: displayName,
  slot: 'Inner',
})(({ theme }) => {
  const { color, typography, mixins, transition } = theme;
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
  const { clsPrefix, color, transition } = theme;
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
      color: color.text.hint,
    },
    [`.${clsPrefix}-input__suffix-clear`]: {
      cursor: 'pointer',
      transition: transition.standard('color'),
      '&:hover': {
        color: color.text.secondary,
      },
    },
  };
});

const Input = React.forwardRef<HTMLSpanElement, InputProps>((props, ref) => {
  const { clsPrefix, componentSize } = useTheme();

  const {
    className,
    style,
    size = componentSize,
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
    onBlur,
    onFocus,
    onCompositionStart,
    onCompositionEnd,
    ...others
  } = props;

  const [value, handleValueChange] = usePropChange(defaultValue, valueProp, onChange);

  const [focused, setFocused] = React.useState(false);

  const rootRef = React.useRef<HTMLSpanElement>(null);

  const forkRef = useForkRef(rootRef, ref);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const removePasswordTimerRef = React.useRef<NodeJS.Timeout>();

  const isCompositingRef = React.useRef<boolean>(false);
  const oldCompositionValueRef = React.useRef<string>();
  const oldSelectionStartRef = React.useRef<number | null>();

  const hasMaxLength = Number(maxLength) > 0;

  const handleChange = useConstantFn((e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value;
    if (typeof v === 'undefined' || v === null) {
      v = '';
    }

    // 处理emoji, '👏'.length === 2
    if (!isCompositingRef.current && hasMaxLength) {
      console.log('handleChange1');
      v = getFixedString(value, maxLength!).value;
    }
    console.log('handleChange');

    handleValueChange(v);
  });

  const handleCompositionStart = useConstantFn((e: React.CompositionEvent<HTMLInputElement>) => {
    oldCompositionValueRef.current = value;
    oldSelectionStartRef.current = e.currentTarget.selectionStart;
    isCompositingRef.current = true;
    onCompositionStart?.(e);
    console.log('handleCompositionStart');
  });

  const handleCompositionEnd = useConstantFn((e: React.CompositionEvent<HTMLInputElement>) => {
    isCompositingRef.current = false;
    let triggerValue = e.currentTarget.value;
    if (hasMaxLength) {
      const isCursorEnd =
        oldSelectionStartRef.current! >= maxLength! + 1 ||
        oldSelectionStartRef.current === oldCompositionValueRef.current!.length;
      triggerValue = getCompositionValue(
        triggerValue,
        oldCompositionValueRef.current!,
        maxLength!,
        isCursorEnd,
      );
    }

    handleValueChange(triggerValue);

    console.log('handleCompositionEnd');

    onCompositionEnd?.(e);
  });

  const focus = useConstantFn(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  });

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
    if (!disabled && !readOnly) {
      setFocused(true);
    }
    onFocus?.(e);
  });

  const handleBlur = useConstantFn((e: React.FocusEvent<HTMLInputElement>) => {
    if (!disabled && !readOnly) {
      setFocused(false);
    }
    onBlur?.(e);
  });

  const handleReset = useConstantFn(() => {
    handleValueChange('');
  });

  // 将input focus绑定到span上
  React.useEffect(() => {
    if (rootRef.current) {
      rootRef.current.focus = focus;
    }
  }, [focus]);

  React.useEffect(() => {
    if (disabled || readOnly) {
      setFocused(false);
    }
  }, [disabled, readOnly]);

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
    `${rootClassName}--size-${size}`,
    {
      [`${rootClassName}--focused`]: focused,
      [`${rootClassName}--disabled`]: disabled,
      [`${rootClassName}--readonly`]: readOnly,
    },
    className,
  );

  let showCountNode: React.ReactNode;

  let actualValue = value;

  if (showCount) {
    let length = 0;

    if (hasMaxLength) {
      const fixedString = getFixedString(value, maxLength!);
      actualValue = fixedString.value;
      length = fixedString.length;
    }

    const msg = `${length}${hasMaxLength ? `/${maxLength}` : ''}`;

    const countClasses = clsx(`${rootClassName}__suffix-count`, {
      [`${rootClassName}__suffix--has-suffix`]: typeof suffix !== 'undefined',
    });

    showCountNode = <span className={countClasses}>{msg}</span>;
  }

  let allowClearNode: React.ReactNode;

  if (allowClear && value.length) {
    const clearClasses = clsx(`${rootClassName}__suffix-clear`, {
      [`${rootClassName}__suffix--has-suffix`]: showCountNode,
    });

    allowClearNode = (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events
      <span role='button' tabIndex={-1} className={clearClasses} onClick={handleReset}>
        <CloseCircleFilled />
      </span>
    );
  }

  return (
    <InputRoot style={style} styleProps={{ size }} className={rootClasses} ref={forkRef}>
      {typeof addonBefore !== 'undefined' && (
        <InputAddonBefore styleProps={{ size }} className={`${rootClassName}__addon-before`}>
          {addonBefore}
        </InputAddonBefore>
      )}
      <InputWrapper
        className={`${rootClassName}__wrapper`}
        styleProps={{ focused, size, disabled, readOnly }}
        onMouseUp={handleMouseUp}
      >
        {typeof prefix !== 'undefined' && (
          <InputPrefix className={`${rootClassName}__prefix`}>{prefix}</InputPrefix>
        )}
        <InputInner
          aria-disabled={disabled}
          aria-readonly={readOnly}
          {...others}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          disabled={disabled}
          readOnly={readOnly}
          ref={inputRef}
          onFocus={handleFocus}
          onBlur={handleBlur}
          type={type}
          className={`${rootClassName}__inner`}
          value={actualValue}
          onChange={handleChange}
        />
        {(allowClearNode || showCountNode || typeof suffix !== 'undefined') && (
          <InputSuffix className={`${rootClassName}__suffix`}>
            {allowClearNode}
            {showCountNode}
            {suffix}
          </InputSuffix>
        )}
      </InputWrapper>
      {typeof addonAfter !== 'undefined' && (
        <InputAddonAfter styleProps={{ size }} className={`${rootClassName}__addon-after`}>
          {addonAfter}
        </InputAddonAfter>
      )}
    </InputRoot>
  );
});

if (!env.isProduction) {
  Input.displayName = displayName;
  Input.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    prefix: PropTypes.node,
    suffix: PropTypes.node,
    addonBefore: PropTypes.node,
    addonAfter: PropTypes.node,
    defaultValue: PropTypes.string,
    value: PropTypes.string,
    maxLength: PropTypes.number,
    showCount: PropTypes.bool,
    allowClear: PropTypes.bool,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    size: PropTypes.oneOf<ComponentSize>(['large', 'middle', 'small']),
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
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
  };
}

export default Input;

const getCompositionValue = (
  currentValue: string,
  prevValue: string,
  maxLength: number,
  isCursorEnd: boolean,
) => {
  const { value, length } = getFixedString(currentValue, maxLength);
  if (isCursorEnd) {
    return value;
  }
  if (length < maxLength) {
    return value;
  }

  return prevValue;
};

const getFixedString = (value: string, maxLength: number) => {
  const array = [...value].slice(0, maxLength);

  return {
    value: array.join(''),
    length: array.length,
  };
};
