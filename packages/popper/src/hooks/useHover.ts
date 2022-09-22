import { useConstantFn } from '@xl-vision/hooks';
import { useRef } from 'react';
import { InteractionHook } from '../useInteraction';

const MIN_TIME_DELAY = 200;

export type HoverOptions = {
  disablePopperEnter?: boolean;
  delay?: number | { open: number; close: number };
};

const useHover: InteractionHook<HoverOptions> = (
  { setOpen },
  { skip, disablePopperEnter, delay: delayProp = 0 } = {},
) => {
  const timerRef = useRef<number>();

  const delay = typeof delayProp === 'object' ? delayProp : { open: delayProp, close: delayProp };

  const handleReferenceMouseEnter = useConstantFn(() => {
    const timer = timerRef.current;
    clearTimeout(timer);

    timerRef.current = window.setTimeout(() => {
      setOpen(true);
    }, Math.max(delay.open, MIN_TIME_DELAY));
  });

  const handleReferenceMouseLeave = useConstantFn(() => {
    const timer = timerRef.current;
    clearTimeout(timer);

    timerRef.current = window.setTimeout(() => {
      setOpen(false);
    }, Math.max(delay.close, MIN_TIME_DELAY));
  });

  const handlePopperMouseEnter = useConstantFn(() => {
    if (!disablePopperEnter) {
      const timer = timerRef.current;
      clearTimeout(timer);
    }
  });

  const handlePopperMouseLeave = useConstantFn(() => {
    const timer = timerRef.current;
    clearTimeout(timer);

    timerRef.current = window.setTimeout(() => {
      setOpen(false);
    }, Math.max(delay.close, MIN_TIME_DELAY));
  });

  if (skip) {
    return {};
  }

  return {
    reference: {
      onMouseEnter: handleReferenceMouseEnter,
      onMouseLeave: handleReferenceMouseLeave,
    },
    popper: {
      onMouseEnter: handlePopperMouseEnter,
      onMouseLeave: handlePopperMouseLeave,
    },
  };
};

export default useHover;
