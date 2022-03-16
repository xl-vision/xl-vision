import { env } from '@xl-vision/utils';
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { CSSObject } from '@xl-vision/styled-engine';
import { useConstantFn, useForkRef, usePrevious } from '@xl-vision/hooks';
import { CloseCircleFilled } from '@xl-vision/icons';
import { styled } from '../styles';
import { ComponentSize, useTheme } from '../ThemeProvider';
import { alpha } from '../utils/color';
import usePropChange from '../hooks/usePropChange';
import useInput from '../hooks/useInput';

export type TextAreaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'onChange' | 'value' | 'defaultValue'
> & {
  onChange?: (value: string) => void;
  value?: string;
  defaultValue?: string;
  showCount?: boolean;
  allowClear?: boolean;
  size?: ComponentSize;
  autoSize?: boolean | { minRows?: number; maxRows?: number };
};

const displayName = 'TextArea';

const TextAreaRoot = styled('span', {
  name: displayName,
  slot: 'Root',
})<{ size: ComponentSize; focused: boolean; disabled?: boolean; readOnly?: boolean }>(
  ({ theme, styleProps }) => {
    const { color, styleSize, typography, transition, clsPrefix } = theme;

    const { size, focused, disabled, readOnly } = styleProps;

    const themeSize = styleSize[size];

    const styles: CSSObject = {
      ...typography.body1.style,
      display: 'inline-block',
      width: '100%',
      position: 'relative',
      backgroundColor: color.background.paper,
      border: `${themeSize.border}px solid ${color.divider}`,
      borderRadius: themeSize.borderRadius,
      transition: transition.standard(['borderColor', 'boxShadow']),
      [`.${clsPrefix}-textarea__inner`]: {
        padding: `${themeSize.padding.y}px ${themeSize.padding.x}px`,
      },
      [`.${clsPrefix}-textarea__suffix`]: {
        position: 'absolute',
        top: 0,
        right: themeSize.padding.x,
        padding: `${themeSize.padding.y}px 0`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      },
      [`.${clsPrefix}-textarea__clear`]: {
        color: color.text.secondary,
      },
      [`.${clsPrefix}-textarea__count`]: {
        color: color.text.hint,
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

const TextAreaInner = styled('textarea', {
  name: displayName,
  slot: 'Inner',
})(({ theme }) => {
  const { mixins, typography } = theme;
  return {
    ...typography.body1.style,
    ...mixins.placeholder(),
    border: 0,
    outline: 0,
    backgroundColor: 'transparent',
    width: '100%',
    boxSizing: 'border-box',
    verticalAlign: 'bottom',
    resize: 'vertical',
  };
});

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>((props, ref) => {
  const { clsPrefix, componentSize } = useTheme();

  const {
    defaultValue = '',
    value: valueProp,
    onChange,
    maxLength,
    showCount,
    allowClear,
    disabled,
    readOnly,
    size = componentSize,
    className,
    onFocus,
    onBlur,
    style,
    ...others
  } = props;

  const [value, handleValueChange] = usePropChange(defaultValue, valueProp, onChange);

  const prevValue = usePrevious(value);

  const [focused, setFocused] = React.useState(false);

  const {
    hasMaxLength,
    ref: textareaRef,
    getWordInfo,
  } = useInput<HTMLTextAreaElement>({ setValue: handleValueChange, maxLength });

  const rootRef = React.useRef<HTMLSpanElement>(null);

  const forkRef = useForkRef(rootRef, ref);

  const focus = useConstantFn(() => {
    if (!disabled && !readOnly) {
      textareaRef.current?.focus();
    }
  });

  // 将textarea focus绑定到span上
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

  const handleResize = useConstantFn((v: string) => {
    if (v === prevValue) {
      return;
    }
  });

  React.useEffect(() => {
    handleResize(value);
  }, [value, handleResize]);

  const handleFocus = useConstantFn((e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (!disabled && !readOnly) {
      setFocused(true);
    }
    onFocus?.(e);
  });

  const handleBlur = useConstantFn((e: React.FocusEvent<HTMLTextAreaElement>) => {
    setFocused(false);
    onBlur?.(e);
  });

  const handleChange = useConstantFn((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let v = e.target.value;
    if (typeof v === 'undefined' || v === null) {
      v = '';
    }

    v = getWordInfo(v).value;

    handleValueChange(v);
  });

  const handleReset = useConstantFn(() => {
    handleValueChange('');
  });

  const rootClassName = `${clsPrefix}-textarea`;

  const rootClasses = clsx(
    rootClassName,
    {
      [`${rootClassName}--focused`]: focused,
      [`${rootClassName}--disabled`]: disabled,
      [`${rootClassName}--readonly`]: readOnly,
    },
    className,
  );

  // 始终按照受控显示
  const { value: actualValue, wordCount } = getWordInfo(value, true);

  let showCountNode: React.ReactNode;

  if (showCount) {
    const msg = `${wordCount}${hasMaxLength ? `/${maxLength}` : ''}`;

    showCountNode = <span className={`${rootClassName}__count`}>{msg}</span>;
  }

  const showClearNode = !disabled && !readOnly && allowClear && (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <span role='button' tabIndex={-1} className={`${rootClassName}__clear`} onClick={handleReset}>
      <CloseCircleFilled />
    </span>
  );

  const suffixNode = (showClearNode || showCountNode) && (
    <span className={`${rootClassName}__suffix`}>
      {showClearNode || <span />}
      {showCountNode || <span />}
    </span>
  );

  return (
    <TextAreaRoot
      ref={forkRef}
      style={style}
      styleProps={{ focused, size, disabled, readOnly }}
      className={rootClasses}
    >
      <TextAreaInner
        aria-disabled={disabled}
        aria-readonly={readOnly}
        {...others}
        ref={textareaRef}
        className={`${rootClassName}__inner`}
        value={actualValue}
        readOnly={readOnly}
        disabled={disabled}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {suffixNode}
    </TextAreaRoot>
  );
});

if (env.isDevelopment) {
  TextArea.displayName = displayName;
  TextArea.propTypes = {
    value: PropTypes.string,
    defaultValue: PropTypes.string,
    onChange: PropTypes.func,
    showCount: PropTypes.bool,
    allowClear: PropTypes.bool,
    maxLength: PropTypes.number,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    size: PropTypes.oneOf<ComponentSize>(['large', 'middle', 'small']),
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.object,
  };
}

export default TextArea;
