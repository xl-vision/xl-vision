import { useConstantFn } from '@xl-vision/hooks';
import { InteractionHook } from '../useInteraction';

export type HoverOptions = {
  enablePopperEnter?: boolean;
  delay?: number | { open: number; close: number };
};

const useHover: InteractionHook<HoverOptions | void> = (
  { refs, update, open, setOpen, eventEmitter },
  { enablePopperEnter, delay, disable } = {},
) => {
  const handleReferenceMouseEnter = useConstantFn(() => {
    if (disable) {
      return;
    }
    setOpen?.(true);
  });

  const handleReferenceMouseLeave = useConstantFn(() => {
    if (disable) {
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
