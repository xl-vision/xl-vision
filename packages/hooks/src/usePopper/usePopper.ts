import { RefCallback, useCallback, useRef, useState } from 'react';
import useLayoutEffect from '../useIsomorphicLayoutEffect';
import computePosition from './utils/computePosition';
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
    extra: {},
  });

  const update = useCallback(() => {
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
  }, [placement, mode, middlewares]);

  const setReference: RefCallback<Element | VirtualElement> = useCallback(
    (el) => {
      referenceRef.current = el;
      update();
    },
    [update],
  );
  const setPopper: RefCallback<Element> = useCallback(
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
    ...data,
    update,
    reference: setReference,
    popper: setPopper,
    mode,
  };
};

export default usePopper;
