import { useConstantFn } from '@xl-vision/hooks';
import { useEffect, useRef } from 'react';
import { InteractionHook } from '../useInteraction';

export type FocusOptions = {
  delay?: number | { open: number; close: number };
};

const useFocus: InteractionHook<FocusOptions> = ({ setOpen }, { skip, delay: delayProp } = {}) => {
  const timerRef = useRef<number>();

  const delay = typeof delayProp === 'object' ? delayProp : { open: delayProp, close: delayProp };

  const handleFocus = useConstantFn(() => {
    const timer = timerRef.current;
    clearTimeout(timer);

    timerRef.current = window.setTimeout(() => {
      setOpen(true);
    }, delay.open);
  });

  const handleBlur = useConstantFn(() => {
    const timer = timerRef.current;
    clearTimeout(timer);

    timerRef.current = window.setTimeout(() => {
      setOpen(false);
    }, delay.close);
  });

  if (skip) {
    return {};
  }

  return {
    reference: {
      onFocus: handleFocus,
      onBlur: handleBlur,
    },
  };
};

export default useFocus;
