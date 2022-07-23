import { useConstantFn } from '@xl-vision/hooks';
import { InteractionHook } from '../useInteraction';

export type HoverOptions = {
  enablePopperEnter?: boolean;
  delay?: number | { open: number; close: number };
};

const useHover: InteractionHook<HoverOptions | void> = (
  { refs, update, open, setOpen },
  { enablePopperEnter, delay, disable } = {},
) => {
  const handleReferenceMouseEnter = useConstantFn(() => {
    setOpen?.(true);
  });

  const handleReferenceMouseLeave = useConstantFn(() => {
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
