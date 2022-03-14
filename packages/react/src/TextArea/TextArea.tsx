import { env } from '@xl-vision/utils';
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { CSSObject } from '@xl-vision/styled-engine';
import { useConstantFn } from '@xl-vision/hooks';
import { styled } from '../styles';
import { ComponentSize, useTheme } from '../ThemeProvider';
import { alpha } from '../utils/color';
import usePropChange from '../hooks/usePropChange';

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
};

const displayName = 'TextArea';

const TextAreaRoot = styled('div', {
  name: displayName,
  slot: 'Root',
})<{ size: ComponentSize; focused: boolean; disabled?: boolean; readOnly?: boolean }>(
  ({ theme, styleProps }) => {
    const { color, styleSize, typography, transition } = theme;

    const { size, focused, disabled, readOnly } = styleProps;

    const themeSize = styleSize[size];

    const styles: CSSObject = {
      ...typography.body1.style,
      padding: `${themeSize.padding.y}px ${themeSize.padding.x}px`,
      border: `${themeSize.border}px solid ${color.divider}`,
      borderRadius: themeSize.borderRadius,
      transition: transition.standard(['borderColor', 'boxShadow']),
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
    padding: 0,
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
    ...others
  } = props;

  const [value, handleValueChange] = usePropChange(defaultValue, valueProp, onChange);

  const [focused, setFocused] = React.useState(false);

  const handleFocus = useConstantFn((e: React.FocusEvent<HTMLTextAreaElement>) => {
    setFocused(true);
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

    if (maxLength && maxLength > 0) {
      v = v.slice(0, maxLength);
    }

    handleValueChange(v);
  });

  React.useEffect(() => {
    if (disabled || readOnly) {
      setFocused(false);
    }
  }, [disabled, readOnly]);

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

  return (
    <TextAreaRoot styleProps={{ focused, size, disabled, readOnly }} className={rootClasses}>
      <TextAreaInner
        aria-disabled={disabled}
        aria-readonly={readOnly}
        {...others}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        ref={ref}
      />
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
    size: PropTypes.oneOf<ComponentSize>(['large', 'middle', 'small']),
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    className: PropTypes.string,
  };
}

export default TextArea;
