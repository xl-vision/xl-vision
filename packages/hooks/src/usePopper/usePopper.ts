import { RefCallback, useCallback, useRef, useState } from 'react';
import useConstantFn from '../useConstantFn';
import useLayoutEffect from '../useLayoutEffect';
import computePosition from './computePosition';
import { Middleware, Mode, Placement, PopperData, VirtualElement } from './types';

export type PopperOptions = {
  placement: Placement;
  mode?: Mode;
  middlewares?: Array<Middleware>;
};

const usePopper = ({ placement, mode = 'fixed', middlewares }: PopperOptions) => {
  const referenceRef = useRef<Element | VirtualElement | null>();
  const popperRef = useRef<Element | null>();

  const [data, setData] = useState<PopperData>({
    x: 0,
    y: 0,
    placement,
  });

  const update = useConstantFn(() => {
    const reference = referenceRef.current;
    const popper = popperRef.current;

    if (!reference || !popper) {
      return;
    }

    const newData = computePosition({
      reference,
      popper,
      placement,
      mode,
      middlewares: middlewares || [],
    });

    setData((prev) => ({ ...prev, ...newData }));
  });

  const setReference: RefCallback<HTMLElement> = useCallback(
    (el) => {
      referenceRef.current = el;
      update();
    },
    [update],
  );
  const setPopper: RefCallback<HTMLElement> = useCallback(
    (el) => {
      popperRef.current = el;
      update();
    },
    [update],
  );

  useLayoutEffect(() => {
    update();
  }, [update]);

  return {
    update,
    reference: setReference,
    popper: setPopper,
    mode,
    ...data,
  };
};

export default usePopper;
