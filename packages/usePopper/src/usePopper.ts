import { RefCallback, useCallback, useRef, useState } from 'react';
import { Middleware, PopperMode, Placement, PopperData, Reference } from './types';
import computePosition from './utils/computePosition';

export type PopperElementMountedEvent = (
  reference: Reference,
  popper: Element,
  update: () => void,
) => void | (() => void);

export type PopperOptions = {
  placement: Placement;
  middlewares?: Array<Middleware>;
  mode?: PopperMode;
};

const usePopper = ({ placement, mode = 'fixed', middlewares }: PopperOptions) => {
  const referenceRef = useRef<Reference | null>(null);
  const popperRef = useRef<Element | null>(null);

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

  const setReference: RefCallback<Reference> = useCallback(
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

  return {
    ...data,
    update,
    reference: setReference,
    popper: setPopper,
    mode,
  };
};

export default usePopper;
