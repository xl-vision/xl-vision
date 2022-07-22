import { useEffect } from 'react';
import { EnhancementHook } from '../useEnhancement';
import autoUpdate, { AutoUpdateOptions } from '../utils/autoUpdate';

const useAutoUpdate: EnhancementHook<AutoUpdateOptions | void> = (
  { refs, update, disable },
  { ancestorScroll, ancestorResize, elementResize, animationFrame } = {},
) => {
  const referenceEl = refs.reference.current;
  const popperEl = refs.popper.current;

  useEffect(() => {
    if (disable) {
      return;
    }
    if (!referenceEl || !popperEl) {
      return;
    }

    update();

    return autoUpdate(referenceEl, popperEl, update, {
      ancestorResize,
      ancestorScroll,
      animationFrame,
      elementResize,
    });
  }, [
    update,
    referenceEl,
    popperEl,
    ancestorScroll,
    ancestorResize,
    elementResize,
    animationFrame,
    disable,
  ]);
};

export default useAutoUpdate;
