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
import calculateNodeHeight from './calculateNodeHeight';
import TextAreaSuffix from './TextAreaSuffix';

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
  autoHeight?: boolean | { minRows?: number; maxRows?: number };
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
      fontSize: typography.pxToRem(typography.body1.info.size * themeSize.fontSize),
      display: 'inline-block',
      width: '100%',
      position: 'relative',
      backgroundColor: color.background.paper,
      border: `${themeSize.border}px solid ${color.divider}`,
      borderRadius: themeSize.borderRadius,
      transition: transition.standard(['borderColor', 'boxShadow']),
      [`.${clsPrefix}-textarea__inner`]: {
        padding: `${themeSize.padding.y}px ${themeSize.padding.x}px`,
        // 高度最低为一行高度
        minHeight:
          themeSize.padding.y * 2 + typography.body1.info.size * typography.body1.info.lineHeight,
      },
      [`.${clsPrefix}-textarea__suffix`]: {
        position: 'absolute',
        zIndex: 1,
        top: 0,
        right: themeSize.padding.x,
        padding: `${themeSize.padding.y}px 0`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        '&--overflow': {
          flexDirection: 'row',
          alignItems: 'center',
        },
        '&:not(&--overflow)': {
          [`.${clsPrefix}-textarea__count`]: {
            marginTop: 'auto',
          },
        },
      },
      [`.${clsPrefix}-textarea__clear`]: {
        color: color.text.hint,
        display: 'inline-flex',
        alignItems: 'center',
        cursor: 'pointer',
        transition: transition.standard('color'),
        '&:hover': {
          color: color.text.secondary,
        },
      },
      [`.${clsPrefix}-textarea__count`]: {
        color: color.text.hint,
        backgroundColor: color.background.paper,
        marginLeft: 4,
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
})<{ autoHeight?: boolean }>(({ theme, styleProps }) => {
  const { mixins, typography } = theme;

  const { autoHeight } = styleProps;

  const styles: CSSObject = {
    ...typography.body1.style,
    ...mixins.placeholder(),
    fontSize: 'inherit',
    border: 0,
    outline: 0,
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    verticalAlign: 'bottom',
    resize: 'vertical',
  };

  if (autoHeight) {
    styles.resize = 'none';
  }

  return styles;
});

export enum ResizeStatus {
  RESIZING,
  RESIZED,
}

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
    autoHeight,
    ...others
  } = props;

  const [value, handleValueChange] = usePropChange(defaultValue, valueProp, onChange);

  const prevValue = usePrevious(value);

  const [focused, setFocused] = React.useState(false);

  const [textAreaStyles, setTextAreaStyle] = React.useState<React.CSSProperties>();

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

  const handleResize = useConstantFn((_value: string) => {
    if (prevValue === _value) {
      return;
    }

    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    const minRows = typeof autoHeight === 'object' ? autoHeight.minRows : null;
    const maxRows = typeof autoHeight === 'object' ? autoHeight.maxRows : null;

    const styles = calculateNodeHeight(textarea, minRows, maxRows);
    setTextAreaStyle(styles);
  });

  React.useEffect(() => {
    if (autoHeight) {
      handleResize(value);
    } else {
      // 清除样式，避免下次开启autoHeight时，尺寸抖动
      setTextAreaStyle({});
    }
  }, [value, autoHeight, handleResize]);

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
    `${rootClassName}--size-${size}`,
    {
      [`${rootClassName}--focused`]: focused,
      [`${rootClassName}--disabled`]: disabled,
      [`${rootClassName}--readonly`]: readOnly,
      [`${rootClassName}--auto-height`]: autoHeight,
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

  const showClearNode = !disabled && !readOnly && allowClear && wordCount > 0 && (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <span role='button' tabIndex={-1} className={`${rootClassName}__clear`} onClick={handleReset}>
      <CloseCircleFilled />
    </span>
  );

  const suffixNode = (showClearNode || showCountNode) && (
    <TextAreaSuffix>
      {showClearNode}
      {showCountNode}
    </TextAreaSuffix>
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
        // 取消autoHeight时，立刻移除样式
        style={autoHeight ? textAreaStyles : {}}
        styleProps={{ autoHeight: !!autoHeight }}
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
    autoHeight: PropTypes.oneOfType([
      PropTypes.bool.isRequired,
      PropTypes.shape({
        minRows: PropTypes.number.isRequired,
        maxRows: PropTypes.number.isRequired,
      }),
    ]),
    size: PropTypes.oneOf<ComponentSize>(['large', 'middle', 'small']),
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.object,
  };
}

export default TextArea;
