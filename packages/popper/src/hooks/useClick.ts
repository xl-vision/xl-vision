import { useConstantFn } from '@xl-vision/hooks';
import { useEffect, useRef } from 'react';
import { InteractionHook } from '../useInteraction';

export type ClickOptions = {
  disablePopperClick?: boolean;
};

const useClick: InteractionHook<ClickOptions> = (
  { setOpen },
  { skip, disablePopperClick = true } = {},
) => {
  const timerRef = useRef<number>();

  const handleClick = useConstantFn(() => {
    clearTimeout(timerRef.current);
    setOpen(true);
  });

  const handlePopperClick = useConstantFn(() => {
    if (!disablePopperClick) {
      clearTimeout(timerRef.current);
      setOpen(true);
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

    window.addEventListener('click', fn, { capture: true });

    return () => {
      window.removeEventListener('click', fn);
    };
  }, [skip, setOpen]);

  if (skip) {
    return {};
  }

  return {
    reference: {
      onClick: handleClick,
    },
    popper: {
      onClick: handlePopperClick,
    },
  };
};

export default useClick;
