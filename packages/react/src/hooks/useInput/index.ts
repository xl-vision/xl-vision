import { useConstantFn } from '@xl-vision/hooks';
import { useEffect, useRef, useState } from 'react';

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

  const oldCompositionValueRef = useRef<string>(null);
  const oldSelectionEndRef = useRef<number>(null);

  const hasMaxLength = Number(maxLength) > 0;

  const handleCompositionStart = useConstantFn((e: CompositionEvent) => {
    setCompositing(true);
    oldCompositionValueRef.current = (e.target as HTMLInputElement | HTMLTextAreaElement).value;
    oldSelectionEndRef.current = (e.target as HTMLInputElement | HTMLTextAreaElement).selectionEnd!;
  });

  const handleCompositionEnd = useConstantFn((e: CompositionEvent) => {
    let triggerValue: string = (e.target as HTMLInputElement | HTMLTextAreaElement).value || '';

    if (hasMaxLength) {
      const oldSelectionEnd = oldSelectionEndRef.current!;
      const oldCompositionValue = oldCompositionValueRef.current!;

      const isCursorEnd =
        // 选中内容到结尾
        oldSelectionEnd >= oldCompositionValue.length;
      triggerValue = getCompositionValue(
        triggerValue,
        oldCompositionValue,
        maxLength!,
        isCursorEnd,
      );
    }

    setValue(triggerValue);
    setCompositing(false);
  });

  useEffect(() => {
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

  const getWordInfo = useConstantFn((words: string, ignoreMaxLength?: boolean) => {
    if (!ignoreMaxLength && !isCompositing && hasMaxLength) {
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
  if (wordCount <= maxLength) {
    return value;
  }

  return prevValue;
};

const getFixedStringInfo = (value: string, maxWordCount?: number) => {
  let array = [...value];

  if (maxWordCount !== undefined) {
    array = array.slice(0, maxWordCount);
  }

  return {
    value: array.join(''),
    wordCount: array.length,
  };
};
