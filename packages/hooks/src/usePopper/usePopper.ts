import { RefCallback, useCallback, useRef, useState } from 'react';
import useLayoutEffect from '../useIsomorphicLayoutEffect';
import computePosition from './utils/computePosition';
import { Middleware, PopperMode, Placement, PopperData, VirtualElement } from './types';
import useConstantFn from '../useConstantFn';

export type PopperElementMountedEvent = (
  reference: Element | VirtualElement,
  popper: Element,
  update: () => void,
) => void | (() => void);

export type PopperOptions = {
  placement: Placement;
  mode?: PopperMode;
  middlewares?: Array<Middleware>;
  onElementMounted?: PopperElementMountedEvent;
};

const usePopper = ({ placement, mode = 'fixed', middlewares, onElementMounted }: PopperOptions) => {
  const referenceRef = useRef<Element | VirtualElement | null>();
  const popperRef = useRef<Element | null>();

  const cleanupElementMountedRef = useRef<() => void>();

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

  const handleElementMount = useConstantFn(() => {
    if (cleanupElementMountedRef.current) {
      cleanupElementMountedRef.current();
      cleanupElementMountedRef.current = undefined;
    }

    if (referenceRef.current && popperRef.current) {
      if (onElementMounted) {
        const cleanupFn = onElementMounted(referenceRef.current, popperRef.current, update);
        if (typeof cleanupFn === 'function') {
          cleanupElementMountedRef.current = cleanupFn;
        }
      } else {
        update();
      }
    }
  });

  const setReference: RefCallback<Element | VirtualElement> = useCallback(
    (el) => {
      referenceRef.current = el;
      handleElementMount();
    },
    [handleElementMount],
  );
  const setPopper: RefCallback<Element> = useCallback(
    (el) => {
      popperRef.current = el;
      handleElementMount();
    },
    [handleElementMount],
  );

  useLayoutEffect(() => {
    handleElementMount();
  }, [handleElementMount]);

  return {
    ...data,
    update,
    reference: setReference,
    popper: setPopper,
    mode,
  };
};

export default usePopper;
