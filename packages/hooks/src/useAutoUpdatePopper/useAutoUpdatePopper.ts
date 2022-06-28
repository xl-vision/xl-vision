import { RefCallback, useCallback, useRef } from 'react';
import usePopper, { PopperOptions, VirtualElement } from '../usePopper';
import autoUpdate, { AutoUpdateOptions } from './autoUpdate';

export type AutoUpdatePopperOptions = PopperOptions &
  AutoUpdateOptions & {
    enable?: boolean;
  };

const useAutoUpdatePopper = (options: AutoUpdatePopperOptions) => {
  const { ancestorScroll, ancestorResize, elementResize, animationFrame, ...otherOptions } =
    options;

  const { reference, popper, update, ...others } = usePopper(otherOptions);

  const referenceRef = useRef<Element | VirtualElement | null>();
  const popperRef = useRef<Element | null>();

  const cleanUpRef = useRef<() => void>();

  const handleAutoUpdate = useCallback(() => {
    if (cleanUpRef.current) {
      cleanUpRef.current();
      cleanUpRef.current = undefined;
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

  const setReference: RefCallback<Element | VirtualElement> = useCallback(
    (el) => {
      referenceRef.current = el;
      handleAutoUpdate();
      reference(el);
    },
    [handleAutoUpdate, reference],
  );
  const setPopper: RefCallback<Element> = useCallback(
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
