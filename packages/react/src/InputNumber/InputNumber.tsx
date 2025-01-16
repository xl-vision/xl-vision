import { useConstantFn, useValueChange } from '@xl-vision/hooks';
import { CaretDownOutlined, CaretUpOutlined } from '@xl-vision/icons';
import { BigIntDecimal, isProduction, omit } from '@xl-vision/utils';
import { forwardRef, useState, FocusEventHandler, useEffect } from 'react';
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

  const handleFormatter = useConstantFn((v: InputNumberValueType) => {
    if (v === null) {
      return '';
    }
    if (formatter) {
      return formatter(v);
    }
    return String(v);
  });

  useEffect(() => {
    setInternalValue(handleFormatter(value));
  }, [value, setInternalValue, handleFormatter]);

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

  const updateValue = useConstantFn((newValue: string) => {
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

      if (precision) {
        const magnification = 10 ** precision;

        v = v.multiply(magnification).round().divide(magnification, precision);
      }

      if (max !== undefined && v.greaterThan(max)) {
        v = value;
      } else if (min !== undefined && v.lessThan(min)) {
        v = value;
      }
    } else {
      v = +v;

      if (precision) {
        const magnification = 10 ** precision;

        v = Math.round(+v * magnification) / magnification;
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
    console.log(value, '11111');
    if (!updateValue(internalValue)) {
      console.log(value, '22222');
      setInternalValue(handleFormatter(value));
    }
  });

  const handleInternalValueChange = useConstantFn((str: string) => {
    if (!updateValue(str)) {
      setInternalValue(str);
    }
  });

  const handleUp = useConstantFn(() => {
    const ret =
      value === null ? 0 : highPrecisionMode ? new BigIntDecimal(value).add(step) : +value + step;

    updateValue(ret.toString());
  });

  const handleDown = useConstantFn(() => {
    const ret =
      value === null
        ? 0
        : highPrecisionMode
          ? new BigIntDecimal(value).subtract(step)
          : +value - step;

    updateValue(ret.toString());
  });

  const suffixNode = !readOnly && !disabled && (
    <InputNumberControls>
      <InputNumberControlUp onClick={handleUp}>
        <CaretUpOutlined />
      </InputNumberControlUp>
      <InputNumberControlDown onClick={handleDown}>
        <CaretDownOutlined />
      </InputNumberControlDown>
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
      {...others}
    />
  );
});

if (!isProduction) {
  InputNumber.displayName = displayName;
  InputNumber.propTypes = {};
}

export default InputNumber;
