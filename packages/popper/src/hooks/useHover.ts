import { useConstantFn } from '@xl-vision/hooks';
import { InteractionHook } from '../useInteractions';

export type HoverOptions = {
  enablePopperEnter?: boolean;
  delay?: number | { open: number; close: number };
};

const useHover: InteractionHook<HoverOptions | void> = (
  { reference, popper, update, open, setOpen },
  { enablePopperEnter, delay } = {},
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
