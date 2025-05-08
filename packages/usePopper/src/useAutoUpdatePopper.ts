import { RefCallback, useCallback, useEffect, useRef } from 'react';
import { Reference } from './types';
import usePopper, { PopperOptions } from './usePopper';
import autoUpdate, { AutoUpdateOptions } from './utils/autoUpdate';

export type AutoUpdatePopperOptions = PopperOptions & AutoUpdateOptions;

const useAutoUpdatePopper = (options: AutoUpdatePopperOptions) => {
  const { ancestorScroll, ancestorResize, elementResize, animationFrame, ...otherOptions } =
    options;

  const { reference, popper, update, ...others } = usePopper(otherOptions);

  const referenceRef = useRef<Reference>(null);
  const popperRef = useRef<Element>(null);

  const cleanUpRef = useRef<() => void>(null);

  const handleAutoUpdate = useCallback(() => {
    if (cleanUpRef.current) {
      cleanUpRef.current();
      cleanUpRef.current = null;
    }

    const referenceEl = referenceRef.current;
    const popperEl = popperRef.current;

    if (!referenceEl || !popperEl) {
      return;
    }

    cleanUpRef.current = autoUpdate(referenceEl, popperEl, update, {
      ancestorResize,
      ancestorScroll,
      animationFrame,
      elementResize,
    });
  }, [update, ancestorResize, ancestorScroll, animationFrame, elementResize]);

  useEffect(() => {
    // handle strict mode
    if (!cleanUpRef.current) {
      handleAutoUpdate();
    }
    return () => {
      if (cleanUpRef.current) {
        cleanUpRef.current();
        cleanUpRef.current = null;
      }
    };
  }, [handleAutoUpdate]);

  const setReference: RefCallback<Reference | null> = useCallback(
    (el) => {
      referenceRef.current = el;
      handleAutoUpdate();
      reference(el);
    },
    [handleAutoUpdate, reference],
  );

  const setPopper: RefCallback<Element | null> = useCallback(
    (el) => {
      popperRef.current = el;
      handleAutoUpdate();
      popper(el);
    },
    [handleAutoUpdate, popper],
  );

  return {
    reference: setReference,
    popper: setPopper,
    update,
    ...others,
  };
};

export default useAutoUpdatePopper;
