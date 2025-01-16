import { useConstantFn, useValueChange } from '@xl-vision/hooks';
import { CaretDownOutlined, CaretUpOutlined } from '@xl-vision/icons';
import { BigIntDecimal, isProduction, omit } from '@xl-vision/utils';
import {
  forwardRef,
  useState,
  FocusEventHandler,
  useEffect,
  KeyboardEvent,
  useRef,
  ReactNode,
} from 'react';
import { Input, InputProps } from '../Input';
import { styled } from '../styles';

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
};

const displayName = 'InputNumber';

const InputNumberRoot = styled(Input, {
  name: displayName,
  slot: 'Root',
})(({ theme: { clsPrefix, size: themeSize } }) => {
  return {
    [`&.${clsPrefix}-input--focused`]: {
      [`.${clsPrefix}-input-number__controls`]: {
        opacity: 1,
      },
    },
    [`.${clsPrefix}-input__suffix`]: {
      margin: `-${themeSize.padding.y}px -${themeSize.padding.x}px -${themeSize.padding.y}px 0`,
    },
  };
});

const InputNumberControls = styled('span', {
  name: displayName,
  slot: 'Controls',
})(({ theme: { size: themeSize, colors } }) => {
  return {
    opacity: 0,
    display: 'flex',
    height: '100%',
    borderLeft: `${themeSize.border}px solid ${colors.divider.primary}`,
    flexDirection: 'column',
  };
});

const InputNumberControlUp = styled('span', {
  name: displayName,
  slot: 'ControlUp',
})(({ theme: { transitions } }) => {
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

const InputNumber = forwardRef<HTMLSpanElement, InputNumberProps>((props, ref) => {
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
    ...others
  } = omit(
    props as InputProps,
    'allowClear',
    'showCount',
    'suffix',
    'maxLength',
  ) as InputNumberProps;

  const [value, setValue] = useValueChange(defaultValue, valueProp, onChange);

  const [internalValue, setInternalValue] = useState<string>('');

  const keyTimerRef = useRef<number>(null);

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

      if (max !== undefined && v.greaterThan(max)) {
        v = value;
      } else if (min !== undefined && v.lessThan(min)) {
        v = value;
      }
    } else {
      v = +v;

      if (precision && !formatter) {
        const magnification = 10 ** precision;

        const v2 = Math.round(+v * magnification) / magnification;

        if (ignorePercision && v !== v2) {
          return false;
        }
        v = v2;
      }

      if (max !== undefined && v > +max) {
        v = value;
      } else if (min !== undefined && v < +min) {
        v = value;
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

  const handleKeyDown = useConstantFn((e: KeyboardEvent) => {
    if (!keyboard) {
      return;
    }
    const timer = keyTimerRef.current;
    if (timer) {
      clearInterval(timer);
      keyTimerRef.current = null;
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

  const handleKeyUp = useConstantFn(() => {
    const timer = keyTimerRef.current;
    if (timer) {
      clearInterval(timer);
      keyTimerRef.current = null;
    }
  });

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

  const suffixNode = !readOnly && !disabled && controls && (
    <InputNumberControls>
      <InputNumberControlUp onClick={handleUp}>{upIcon}</InputNumberControlUp>
      <InputNumberControlDown onClick={handleDown}>{downIcon}</InputNumberControlDown>
    </InputNumberControls>
  );

  return (
    <InputNumberRoot
      disabled={disabled}
      readOnly={readOnly}
      ref={ref}
      suffix={suffixNode}
      value={internalValue}
      onBlur={handleBlur}
      onChange={handleInternalValueChange}
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
