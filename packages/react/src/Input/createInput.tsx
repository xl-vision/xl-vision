import React from 'react';
import { env } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { useConstantFn } from '@xl-vision/hooks';
import usePropChange from '../hooks/usePropChange';

export type ElementAttribute = {
  value: string;
};

export type BaseInputProps = {
  value?: string;
  defaultValue?: string;
  maxLength?: number;
  onChange?: (value: string) => void;
  onCompositionStart?: React.CompositionEventHandler;
  onCompositionEnd?: React.CompositionEventHandler;
};

const displayName = 'BaseInput';

export type ElementMap = {
  input: HTMLInputElement;
  textarea: HTMLTextAreaElement;
};

const createInput = <
  P extends BaseInputProps = BaseInputProps,
  E extends keyof ElementMap = keyof ElementMap,
  ElementType = ElementMap[E],
>(
  Component: E,
) => {
  const BaseInput = React.forwardRef<ElementType, P>((props, ref) => {
    const {
      defaultValue = '',
      value: valueProp,
      maxLength,
      onChange,
      onCompositionEnd,
      onCompositionStart,
      ...others
    } = props;

    const [value, handleValueChange] = usePropChange(defaultValue, valueProp, onChange);

    const [isCompositing, setCompositing] = React.useState(false);
    const oldCompositionValueRef = React.useRef<string>();
    const oldSelectionStartRef = React.useRef<number | null>();

    const hasMaxLength = Number(maxLength) > 0;

    const handleChange = useConstantFn((e: React.ChangeEvent<HTMLInputElement>) => {
      let v = e.target.value;
      if (typeof v === 'undefined' || v === null) {
        v = '';
      }

      // 处理emoji, '👏'.length === 2
      if (!isCompositing && hasMaxLength) {
        v = getFixedString(v, maxLength!).value;
      }

      handleValueChange(v);
    });

    const handleCompositionStart = useConstantFn((e: React.CompositionEvent<HTMLInputElement>) => {
      oldCompositionValueRef.current = value;
      oldSelectionStartRef.current = e.currentTarget.selectionStart;
      setCompositing(true);
      onCompositionStart?.(e);
    });

    const handleCompositionEnd = useConstantFn((e: React.CompositionEvent<HTMLInputElement>) => {
      setCompositing(false);
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

      onCompositionEnd?.(e);
    });

    let actualValue = value;

    if (!isCompositing && hasMaxLength) {
      const fixedString = getFixedString(value, maxLength!);
      actualValue = fixedString.value;
    }

    return (
      <Component
        {...others}
        value={actualValue}
        onChange={handleChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        ref={ref}
      />
    );
  });

  if (!env.isProduction) {
    BaseInput.displayName = displayName;
    BaseInput.propTypes = {
      defaultValue: PropTypes.string,
      value: PropTypes.string,
      maxLength: PropTypes.number,
      onChange: PropTypes.func,
      onCompositionStart: PropTypes.func,
      onCompositionEnd: PropTypes.func,
    };
  }

  return BaseInput;
};

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

const A = createInput('textarea');

<A />;
