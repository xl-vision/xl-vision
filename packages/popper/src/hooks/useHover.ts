import { useConstantFn } from '@xl-vision/hooks';
import { EnhancementHook } from '../useEnhancement';

export type HoverOptions = {
  enablePopperEnter?: boolean;
  delay?: number | { open: number; close: number };
};

const useHover: EnhancementHook<HoverOptions | void> = (
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
