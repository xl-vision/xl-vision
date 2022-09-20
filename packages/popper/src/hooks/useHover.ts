import { useConstantFn } from '@xl-vision/hooks';
import { InteractionHook } from '../useInteraction';

export type HoverOptions = {
  enablePopperEnter?: boolean;
  delay?: number | { open: number; close: number };
};

const useHover: InteractionHook<HoverOptions | void> = ({ setOpen }, { skip } = {}) => {
  const handleReferenceMouseEnter = useConstantFn(() => {
    if (skip) {
      return;
    }
    setOpen?.(true);
  });

  const handleReferenceMouseLeave = useConstantFn(() => {
    if (skip) {
      return;
    }
    setOpen?.(false);
  });

  return {
    reference: {
      onMouseEnter: handleReferenceMouseEnter,
      onMouseLeave: handleReferenceMouseLeave,
    },
    popper: {},
  };
};

export default useHover;
