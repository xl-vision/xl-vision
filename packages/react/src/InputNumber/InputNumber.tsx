import { useConstantFn, useForkRef, useValueChange } from '@xl-vision/hooks';
import { CaretDownOutlined, CaretUpOutlined } from '@xl-vision/icons';
import { BigIntDecimal, isProduction, omit } from '@xl-vision/utils';
import clsx from 'clsx';
import {
  forwardRef,
  useState,
  FocusEventHandler,
  useEffect,
  KeyboardEvent,
  useRef,
  ReactNode,
  CompositionEvent,
  useMemo,
} from 'react';
import { Input, InputInstance, InputProps } from '../Input';
import { styled } from '../styles';
import { useTheme } from '../ThemeProvider';

export type InputNumberValueType = number | string | null;

export type InputNumberProps = Omit<
  InputProps,
  | 'type'
  | 'onChange'
  | 'value'
  | 'defaultValue'
  | 'suffix'
  | 'allowClear'
  | 'showCount'
  | 'maxLength'
> & {
  onChange?: (value: InputNumberValueType) => void;
  value?: InputNumberValueType;
  defaultValue?: InputNumberValueType;
  min?: number | string;
  max?: number | string;
  parser?: (value: string) => InputNumberValueType;
  formatter?: (value: number | string) => string;
  step?: number;
  precision?: number;
  highPrecisionMode?: boolean;
  controls?: boolean | { upIcon?: ReactNode; downIcon?: ReactNode };
  keyboard?: boolean;
  wheel?: boolean;
};

export type InputNumberInstance = InputInstance;

const displayName = 'InputNumber';

const InputNumberRoot = styled(Input, {
  name: displayName,
  slot: 'Root',
})(({ theme: { clsPrefix, size: themeSize, transitions } }) => {
  return {
    [`.${clsPrefix}-input__suffix`]: {
      margin: `-${themeSize.padding.y}px -${themeSize.padding.x}px -${themeSize.padding.y}px 0`,
      transform: 'scaleX(0)',
      transformOrigin: '100% 50%',
      transition: transitions.enter('transform'),
      overflow: 'hidden',
    },

    [`&:hover, &.${clsPrefix}-input--focused`]: {
      [`.${clsPrefix}-input__suffix`]: {
        transform: 'scaleX(1)',
      },
    },
  };
});

const InputNumberControls = styled('span', {
  name: displayName,
  slot: 'Controls',
})(({ theme: { size: themeSize, colors } }) => {
  return {
    display: 'flex',
    height: '100%',
    borderLeft: `${themeSize.border}px solid ${colors.divider.primary}`,
    flexDirection: 'column',
  };
});

const InputNumberControlUp = styled('span', {
  name: displayName,
  slot: 'ControlUp',
})(({ theme: { transitions, clsPrefix, colors } }) => {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    height: '40%',
    flex: 'auto',
    fontSize: '10px',
    padding: `0 3px`,
    transition: transitions.standard('all'),
    '&:hover': {
      height: '60%',
    },

    [`&.${clsPrefix}-input-number__control--disabled`]: {
      cursor: 'not-allowed',
      opacity: colors.opacity.disabled,
      '&:hover': {
        height: '40%',
      },
    },
  };
});

const InputNumberControlDown = styled(InputNumberControlUp, {
  name: displayName,
  slot: 'ControlDown',
})(({ theme: { size: themeSize, colors } }) => {
  return {
    borderTop: `${themeSize.border}px solid ${colors.divider.primary}`,
  };
});

const NUMBER_REGEX = /^-?(([1-9]\d+)|\d)(\.\d+)?$/;

const InputNumber = forwardRef<InputNumberInstance, InputNumberProps>((props, ref) => {
  const {
    onChange,
    value: valueProp,
    defaultValue = null,
    min,
    max,
    parser,
    formatter,
    onBlur,
    step = 1,
    precision,
    readOnly,
    disabled,
    controls = true,
    keyboard = true,
    highPrecisionMode,
    wheel,
    onCompositionEnd,
    onCompositionStart,
    onKeyDown,
    onKeyUp,
    ...others
  } = omit(
    props as InputProps,
    'allowClear',
    'showCount',
    'suffix',
    'maxLength',
  ) as InputNumberProps;

  const { clsPrefix } = useTheme();

  const innerRef = useRef<InputNumberInstance>(null);

  const forkRef = useForkRef(ref, innerRef);

  const [value, setValue] = useValueChange(defaultValue, valueProp, onChange);

  const [internalValue, setInternalValue] = useState<string>('');

  const keyTimerRef = useRef<number>(null);
  const isCompositionRef = useRef(false);

  const handleFormatter = useConstantFn((v: InputNumberValueType) => {
    if (v === null) {
      return '';
    }
    if (formatter) {
      return formatter(v);
    }
    if (!precision) {
      return String(v);
    }
    return highPrecisionMode ? new BigIntDecimal(v).toFixed(precision) : (+v).toFixed(precision);
  });

  useEffect(() => {
    setInternalValue(handleFormatter(value));
  }, [value, setInternalValue, handleFormatter]);

  useEffect(() => {
    return () => {
      const timer = keyTimerRef.current;
      if (timer) {
        clearInterval(timer);
      }
    };
  }, []);

  const defaultParser = useConstantFn((newValue: InputNumberValueType) => {
    if (newValue === null) {
      return null;
    }
    if (!highPrecisionMode) {
      return +newValue;
    }
    return newValue;
  });

  const handleParser = useConstantFn((str: string) => {
    if (!str) {
      return null;
    }

    if (parser) {
      const parseredValue = parser(str);

      return defaultParser(parseredValue);
    }

    return defaultParser(str);
  });

  const updateValue = useConstantFn((newValue: string, ignorePercision?: boolean) => {
    if (disabled || readOnly) {
      return true;
    }

    if (!NUMBER_REGEX.test(newValue)) {
      return false;
    }

    let v: BigIntDecimal | InputNumberValueType = handleParser(newValue);

    if (v === null) {
      if (value === null) {
        return false;
      }
      setValue(null);
      return true;
    }

    if (highPrecisionMode) {
      v = new BigIntDecimal(v);

      if (precision && !formatter) {
        const magnification = 10 ** precision;

        const v2 = v.multiply(magnification).round().divide(magnification, precision);

        if (ignorePercision && !v.equal(v2)) {
          return false;
        }

        v = v2;
      }

      if (max !== undefined) {
        const maxBigIntDecimal = new BigIntDecimal(max);

        if (v.greaterThan(maxBigIntDecimal)) {
          v = maxBigIntDecimal;
        }
      }

      if (min !== undefined) {
        const mminBigIntDecimal = new BigIntDecimal(min);

        if (v.lessThan(mminBigIntDecimal)) {
          v = mminBigIntDecimal;
        }
      }
    } else {
      v = Number(v);

      if (precision && !formatter) {
        const magnification = 10 ** precision;

        const v2 = Math.round(v * magnification) / magnification;

        if (ignorePercision && v !== v2) {
          return false;
        }
        v = v2;
      }

      if (max !== undefined) {
        const maxNum = Number(max);
        if (v > maxNum) {
          v = maxNum;
        }
      }

      if (min !== undefined) {
        const minNum = Number(min);
        if (v < minNum) {
          v = minNum;
        }
      }
    }

    if (v instanceof BigIntDecimal) {
      if (v.isNaN()) {
        return false;
      }
      const str = v.toString();

      if (str === value) {
        return false;
      }
      setValue(str);
      return true;
    }

    if (Number.isNaN(v)) {
      return false;
    }
    if (v === value) {
      return false;
    }
    setValue(v);
    return true;
  });

  const handleBlur: FocusEventHandler<HTMLInputElement> = useConstantFn((e) => {
    onBlur?.(e);
    if (!updateValue(internalValue)) {
      setInternalValue(handleFormatter(value));
    }
  });

  const handleInternalValueChange = useConstantFn((str: string) => {
    if (!updateValue(str, true)) {
      setInternalValue(str);
    }
  });

  const handleUp = useConstantFn(() => {
    const ret =
      value === null
        ? step
        : highPrecisionMode
          ? new BigIntDecimal(value).add(step)
          : +value + step;

    updateValue(String(ret));
  });

  const handleDown = useConstantFn(() => {
    const ret =
      value === null
        ? -step
        : highPrecisionMode
          ? new BigIntDecimal(value).subtract(step)
          : +value - step;

    updateValue(ret.toString());
  });

  const handleCompositionStart = useConstantFn((e: CompositionEvent<HTMLInputElement>) => {
    onCompositionStart?.(e);
    isCompositionRef.current = true;
  });

  const handleCompositionEnd = useConstantFn((e: CompositionEvent<HTMLInputElement>) => {
    onCompositionEnd?.(e);
    isCompositionRef.current = false;
  });

  const handleKeyDown = useConstantFn((e: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    const timer = keyTimerRef.current;
    if (timer) {
      clearInterval(timer);
      keyTimerRef.current = null;
    }

    if (isCompositionRef.current) {
      return;
    }

    if (e.key === 'Enter') {
      if (!updateValue(internalValue)) {
        setInternalValue(handleFormatter(value));
      }
      return;
    }

    if (!keyboard) {
      return;
    }

    if (!['ArrowUp', 'ArrowDown'].includes(e.key)) {
      return;
    }

    e.preventDefault();

    const fn = e.key === 'ArrowUp' ? handleUp : handleDown;

    fn();
    keyTimerRef.current = window.setInterval(() => {
      fn();
    }, 500);
  });

  const handleKeyUp = useConstantFn((e: KeyboardEvent<HTMLInputElement>) => {
    onKeyUp?.(e);
    const timer = keyTimerRef.current;
    if (timer) {
      clearInterval(timer);
      keyTimerRef.current = null;
    }
  });

  useEffect(() => {
    if (!wheel) {
      return;
    }

    const wrappEl = innerRef.current?.nativeElement;

    if (!wrappEl) {
      return;
    }

    const input = wrappEl.querySelector<HTMLInputElement>(`input.${clsPrefix}-input__inner`);

    if (!input) {
      return;
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (e.deltaY > 0) {
        handleDown();
      } else if (e.deltaY < 0) {
        handleUp();
      }
    };

    input.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      input.removeEventListener('wheel', handleWheel);
    };
  }, [clsPrefix, handleUp, handleDown, wheel]);

  let upIcon: ReactNode = <CaretUpOutlined />;
  let downIcon: ReactNode = <CaretDownOutlined />;

  if (typeof controls === 'object') {
    if (controls.upIcon) {
      upIcon = controls.upIcon;
    }

    if (controls.downIcon) {
      downIcon = controls.downIcon;
    }
  }

  const isArrowUpDisabled = useMemo(() => {
    if (max === undefined || value === null) {
      return false;
    }

    if (highPrecisionMode) {
      const v = new BigIntDecimal(value);

      return v.equal(max) || v.greaterThan(max);
    }

    return +value >= +max;
  }, [max, value, highPrecisionMode]);

  const isArrowDownDisabled = useMemo(() => {
    if (min === undefined || value === null) {
      return false;
    }

    if (highPrecisionMode) {
      const v = new BigIntDecimal(value);

      return v.equal(min) || v.lessThan(min);
    }

    return +value <= +min;
  }, [min, value, highPrecisionMode]);

  const rootClassName = `${clsPrefix}-input-number`;

  const suffixNode = !readOnly && !disabled && controls && (
    <InputNumberControls>
      <InputNumberControlUp
        className={clsx({
          [`${rootClassName}__control--disabled`]: isArrowUpDisabled,
        })}
        onClick={handleUp}
      >
        {upIcon}
      </InputNumberControlUp>
      <InputNumberControlDown
        className={clsx({
          [`${rootClassName}__control--disabled`]: isArrowDownDisabled,
        })}
        onClick={handleDown}
      >
        {downIcon}
      </InputNumberControlDown>
    </InputNumberControls>
  );

  return (
    <InputNumberRoot
      aria-valuemax={max as number}
      aria-valuemin={min as number}
      autoComplete='off'
      disabled={disabled}
      readOnly={readOnly}
      ref={forkRef}
      role='spinbutton'
      step={step}
      suffix={suffixNode}
      value={internalValue}
      onBlur={handleBlur}
      onChange={handleInternalValueChange}
      onCompositionEnd={handleCompositionEnd}
      onCompositionStart={handleCompositionStart}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      {...others}
    />
  );
});

if (!isProduction) {
  InputNumber.displayName = displayName;
  InputNumber.propTypes = {};
}

export default InputNumber;
