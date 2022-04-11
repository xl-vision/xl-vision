import { RefCallback, useCallback, useRef, useState } from 'react';
import useConstantFn from '../useConstantFn';
import useLayoutEffect from '../useLayoutEffect';
import computePosition from './computePosition';
import base from './middlewares/base';
import { Middleware, Mode, Placement, PopperData } from './types';

export type PopperOptions = {
  placement: Placement;
  mode?: Mode;
  middlewares?: Array<Middleware<any>>;
};

const innerMiddlewares: Array<Middleware<any>> = [base];

const usePopper = ({ placement, mode = 'fixed', middlewares }: PopperOptions) => {
  const referenceRef = useRef<HTMLElement | null>();
  const popperRef = useRef<HTMLElement | null>();

  const [data, setData] = useState<PopperData>({
    x: 0,
    y: 0,
    mode,
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
      middlewares: [...innerMiddlewares, ...(middlewares || [])],
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
    data,
  };
};

export default usePopper;
