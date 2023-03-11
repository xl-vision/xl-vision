import { useEvent } from '@xl-vision/hooks';
import { isObject } from '@xl-vision/utils';
import { useRef } from 'react';
import { InteractionHook } from '../useInteraction';

const MIN_TIME_DELAY = 200;

export type HoverOptions = {
  disablePopperEnter?: boolean;
  delay?: number | { open?: number; close?: number };
};

const useHover: InteractionHook<HoverOptions> = (
  { setOpen },
  { skip, disablePopperEnter, delay: delayProp = 0 } = {},
) => {
  const timerRef = useRef<number>();

  const closeDelay = isObject(delayProp) ? delayProp.close || 0 : delayProp;
  const openDelay = isObject(delayProp) ? delayProp.open || 0 : delayProp;

  const handleReferenceMouseEnter = useEvent(() => {
    const timer = timerRef.current;
    clearTimeout(timer);

    timerRef.current = window.setTimeout(() => {
      setOpen(true);
    }, Math.max(openDelay, MIN_TIME_DELAY));
  });

  const handleReferenceMouseLeave = useEvent(() => {
    const timer = timerRef.current;
    clearTimeout(timer);

    timerRef.current = window.setTimeout(() => {
      setOpen(false);
    }, Math.max(closeDelay, MIN_TIME_DELAY));
  });

  const handlePopperMouseEnter = useEvent(() => {
    if (!disablePopperEnter) {
      const timer = timerRef.current;
      clearTimeout(timer);
    }
  });

  const handlePopperMouseLeave = useEvent(() => {
    const timer = timerRef.current;
    clearTimeout(timer);

    timerRef.current = window.setTimeout(() => {
      setOpen(false);
    }, Math.max(closeDelay, MIN_TIME_DELAY));
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
