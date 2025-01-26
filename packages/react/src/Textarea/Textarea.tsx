import { useConstantFn, usePrevious, useValueChange } from '@xl-vision/hooks';
import { CloseCircleFilled } from '@xl-vision/icons';
import { CSSObject } from '@xl-vision/styled-engine';
import { isObject, isProduction } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import {
  TextareaHTMLAttributes,
  forwardRef,
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  ReactNode,
  FocusEvent,
  CSSProperties,
  useImperativeHandle,
} from 'react';
import { flushSync } from 'react-dom';
import calculateNodeHeight from './calculateNodeHeight';
import useOverflow from './useOverflow';
import useInput from '../hooks/useInput';
import { styled } from '../styles';
import { SizeVariant, useTheme } from '../ThemeProvider';
import { RefInstance } from '../types';

export type TextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'onChange' | 'value' | 'defaultValue'
> & {
  onChange?: (value: string) => void;
  value?: string;
  defaultValue?: string;
  showCount?: boolean;
  allowClear?: boolean;
  size?: SizeVariant;
  autoHeight?: boolean | { minRows?: number; maxRows?: number };
};

export type TextareaInstance = RefInstance<HTMLDivElement>;

const displayName = 'Textarea';

const TextareaRoot = styled('span', {
  name: displayName,
  slot: 'Root',
})<{
  focused: boolean;
  size: SizeVariant;
  disabled?: boolean;
  readOnly?: boolean;
  autoHeight?: boolean;
}>(({ theme, styleProps }) => {
  const { colors, sizes, typography, transitions } = theme;

  const { size, focused, disabled, readOnly } = styleProps;

  const themeSize = sizes[size];

  const fontSize = typography.body1.info.size * themeSize.fontSize;

  const styles: CSSObject = {
    ...typography.body1.style,
    fontSize: typography.pxToRem(fontSize),
    display: 'inline-block',
    width: '100%',
    position: 'relative',
    backgroundColor: colors.background.paper,
    border: `${themeSize.border}px solid ${colors.divider.primary}`,
    borderRadius: themeSize.borderRadius,
    transition: transitions.standard(['borderColor', 'boxShadow']),
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

const TextareaInner = styled('textarea', {
  name: displayName,
  slot: 'Inner',
})<{ autoHeight?: boolean; size: SizeVariant }>(({
  theme: { mixins, typography, sizes },
  styleProps: { autoHeight, size },
}) => {
  const themeSize = sizes[size];

  const fontSize = typography.body1.info.size * themeSize.fontSize;

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
    padding: `${themeSize.padding.y}px ${themeSize.padding.x}px`,
    // 高度最低为一行高度
    minHeight: themeSize.padding.y * 2 + fontSize * typography.body1.info.lineHeight,
  };

  if (autoHeight) {
    styles.resize = 'none';
  }

  return styles;
});

const TextareaSuffix = styled('span', {
  name: displayName,
  slot: 'Suffix',
})<{ overflow?: boolean; size: SizeVariant }>(({
  theme: { sizes },
  styleProps: { overflow, size },
}) => {
  const themeSize = sizes[size];
  return [
    {
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
      boxSizing: 'border-box',
    },
    overflow && {
      flexDirection: 'row',
      alignItems: 'center',
    },
  ];
});

const TextareaClear = styled('span', {
  name: displayName,
  slot: 'Clear',
})(({ theme: { colors, transitions } }) => {
  return {
    color: colors.text.hint,
    display: 'inline-flex',
    alignItems: 'center',
    cursor: 'pointer',
    transition: transitions.standard('color'),
    '&:hover': {
      color: colors.text.secondary,
    },
  };
});

const TextareaCount = styled('span', {
  name: displayName,
  slot: 'Count',
})(({ theme: { colors } }) => {
  return {
    color: colors.text.hint,
    backgroundColor: colors.background.paper,
    marginLeft: 4,
  };
});

export enum ResizeStatus {
  RESIZING,
  RESIZED,
}

const Textarea = forwardRef<TextareaInstance, TextareaProps>((props, ref) => {
  const { sizeVariant } = useTheme();

  const {
    defaultValue = '',
    value: valueProp,
    onChange,
    maxLength,
    showCount,
    allowClear,
    disabled,
    readOnly,
    size = sizeVariant,
    onFocus,
    onBlur,
    style,
    autoHeight,
    ...others
  } = props;

  const [value, handleValueChange] = useValueChange(defaultValue, valueProp, onChange);

  const prevValue = usePrevious(value);

  const [focused, setFocused] = useState(false);

  const [textAreaStyles, setTextAreaStyle] = useState<CSSProperties>();

  const {
    hasMaxLength,
    ref: textareaRef,
    getWordInfo,
  } = useInput<HTMLTextAreaElement>({ setValue: handleValueChange, maxLength });

  const rootRef = useRef<HTMLDivElement>(null);

  const { ref: suffixRef, overflow } = useOverflow<HTMLSpanElement>({ value });

  useImperativeHandle(ref, () => {
    return {
      get nativeElement() {
        return rootRef.current;
      },
    };
  }, []);

  const focus = useConstantFn(() => {
    if (!disabled && !readOnly) {
      textareaRef.current?.focus();
    }
  });

  // 将textarea focus绑定到span上
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

  const handleResize = useConstantFn((_value: string) => {
    if (prevValue === _value) {
      return;
    }

    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    const minRows = isObject(autoHeight) ? autoHeight.minRows : null;
    const maxRows = isObject(autoHeight) ? autoHeight.maxRows : null;

    Promise.resolve()
      .then(() => {
        const styles = calculateNodeHeight(textarea, minRows, maxRows);
        flushSync(() => {
          setTextAreaStyle(styles);
        });
      })
      .catch(console.error);
  });

  useEffect(() => {
    if (autoHeight) {
      handleResize(value);
    } else {
      // 清除样式，避免下次开启autoHeight时，尺寸抖动
      setTextAreaStyle({});
    }
  }, [value, autoHeight, handleResize]);

  const handleFocus = useConstantFn((e: FocusEvent<HTMLTextAreaElement>) => {
    if (!disabled && !readOnly) {
      setFocused(true);
    }
    onFocus?.(e);
  });

  const handleBlur = useConstantFn((e: FocusEvent<HTMLTextAreaElement>) => {
    setFocused(false);
    onBlur?.(e);
  });

  const handleChange = useConstantFn((e: ChangeEvent<HTMLTextAreaElement>) => {
    let v = e.target.value;
    if (v === undefined || v === null) {
      v = '';
    }

    v = getWordInfo(v).value;

    handleValueChange(v);
  });

  const handleReset = useConstantFn(() => {
    handleValueChange('');
  });

  // 始终按照受控显示
  const { value: actualValue, wordCount } = getWordInfo(value, true);

  let showCountNode: ReactNode;

  if (showCount) {
    const msg = `${wordCount}${hasMaxLength ? `/${maxLength}` : ''}`;

    showCountNode = <TextareaCount>{msg}</TextareaCount>;
  }

  const showClearNode = !disabled && !readOnly && allowClear && wordCount > 0 && (
    <TextareaClear aria-label='clear' role='button' tabIndex={-1} onClick={handleReset}>
      <CloseCircleFilled />
    </TextareaClear>
  );

  const suffixNode = (showClearNode || showCountNode) && (
    <TextareaSuffix ref={suffixRef} styleProps={{ overflow, size }}>
      {showClearNode}
      {showCountNode}
    </TextareaSuffix>
  );

  return (
    <TextareaRoot
      ref={rootRef}
      style={style}
      styleProps={{ focused, size, disabled, readOnly, autoHeight: !!autoHeight }}
    >
      <TextareaInner
        aria-disabled={disabled}
        aria-readonly={readOnly}
        {...others}
        disabled={disabled}
        readOnly={readOnly}
        ref={textareaRef}
        style={autoHeight ? textAreaStyles : {}}
        styleProps={{ autoHeight: !!autoHeight, size }}
        value={actualValue}
        onBlur={handleBlur}
        onChange={handleChange}
        onFocus={handleFocus}
      />
      {suffixNode}
    </TextareaRoot>
  );
});

if (!isProduction) {
  Textarea.displayName = displayName;
  Textarea.propTypes = {
    allowClear: PropTypes.bool,
    autoHeight: PropTypes.oneOfType([
      PropTypes.bool.isRequired,
      PropTypes.shape({
        maxRows: PropTypes.number,
        minRows: PropTypes.number,
      }).isRequired,
    ]),
    className: PropTypes.string,
    defaultValue: PropTypes.string,
    disabled: PropTypes.bool,
    maxLength: PropTypes.number,
    readOnly: PropTypes.bool,
    showCount: PropTypes.bool,
    size: PropTypes.oneOf<SizeVariant>(['large', 'middle', 'small']),
    style: PropTypes.shape({}),
    value: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
  };
}

export default Textarea;
