import { RefCallback, useCallback, useRef, useState } from 'react';
import useLayoutEffect from '../useLayoutEffect';
import getRelativePosition from './getRelativePosition';
import { Mode } from './types';

export type PopperData = {
  x: number | undefined;
  y: number | undefined;
  mode: Mode;
};

const usePopper = () => {
  const referenceRef = useRef<HTMLElement | null>();
  const popperRef = useRef<HTMLElement | null>();

  const [data, setData] = useState<PopperData>({
    x: undefined,
    y: undefined,
    mode: 'absolute',
  });

  const update = useCallback(() => {
    const reference = referenceRef.current;
    const popper = popperRef.current;

    if (!reference || !popper) {
      return;
    }

    const { x, y } = getRelativePosition(reference, popper);

    setData((prev) => ({ ...prev, x, y }));
  }, []);

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
