import { useConstantFn } from '@xl-vision/hooks';
import { useEffect, useRef } from 'react';
import { InteractionHook } from '../useInteraction';

export type ContextMenuOptions = {
  disablePopperEnter?: boolean;
};

const useContextMenu: InteractionHook<ContextMenuOptions> = (
  { setOpen },
  { skip, disablePopperEnter } = {},
) => {
  const timerRef = useRef<number>();

  const handleContextMenu = useConstantFn(() => {
    clearTimeout(timerRef.current);
    setOpen(true);
  });

  const handleMouseEnter = useConstantFn(() => {
    if (disablePopperEnter) {
      setOpen(false);
    }
  });

  useEffect(() => {
    if (skip) {
      return;
    }

    const fn = () => {
      timerRef.current = window.setTimeout(() => {
        setOpen(false);
      });
    };

    window.addEventListener('click', fn, true);

    return () => {
      window.removeEventListener('click', fn);
    };
  }, [skip, setOpen]);

  if (skip) {
    return {};
  }

  return {
    reference: {
      onContextMenu: handleContextMenu,
    },
    popper: {
      onMouseEnter: handleMouseEnter,
    },
  };
};

export default useContextMenu;
