import React, { useRef, useState } from 'react';
import useConstantFn from '../../../../hooks/src/useConstantFn';

export type InputProps = {
  setValue: (v: string) => void;
  maxLength?: number;
};

/**
 * 输入框输入hook，帮助输入中文及存在maxLength时的字符处理
 */
const useInput = <E extends HTMLElement>({ setValue, maxLength }: InputProps) => {
  const ref = useRef<E>(null);
  const [isCompositing, setCompositing] = useState(false);

  const oldCompositionValueRef = React.useRef<string>();
  const oldSelectionStartRef = React.useRef<number>();

  const hasMaxLength = Number(maxLength) > 0;

  const handleCompositionStart = useConstantFn((e: CompositionEvent) => {
    setCompositing(true);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    oldCompositionValueRef.current = (e.target as any).value;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    oldSelectionStartRef.current = (e.target as any).selectionStart;
  });

  const handleCompositionEnd = useConstantFn((e: CompositionEvent) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    let triggerValue: string = (e.target as any).value || '';

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

    setValue(triggerValue);
    setCompositing(false);
  });

  React.useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    el.addEventListener('compositionstart', handleCompositionStart);
    el.addEventListener('compositionend', handleCompositionEnd);

    return () => {
      el.removeEventListener('compositionstart', handleCompositionStart);
      el.removeEventListener('compositionend', handleCompositionEnd);
    };
  }, [handleCompositionStart, handleCompositionEnd]);

  const getWordInfo = useConstantFn((words: string) => {
    if (!isCompositing && hasMaxLength) {
      return getFixedStringInfo(words, maxLength);
    }
    return getFixedStringInfo(words);
  });

  return { ref, isCompositing, hasMaxLength, getWordInfo };
};

export default useInput;

const getCompositionValue = (
  currentValue: string,
  prevValue: string,
  maxLength: number,
  isCursorEnd: boolean,
) => {
  const { value, wordCount } = getFixedStringInfo(currentValue, maxLength);
  if (isCursorEnd) {
    return value;
  }
  if (wordCount < maxLength) {
    return value;
  }

  return prevValue;
};

const getFixedStringInfo = (value: string, maxWordCount?: number) => {
  let array = Array.from(value);

  if (maxWordCount !== undefined) {
    array = array.slice(0, maxWordCount);
  }

  return {
    value: array.join(''),
    wordCount: array.length,
  };
};
