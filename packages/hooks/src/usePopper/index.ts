import { isProduction } from '@xl-vision/utils';
import { RefCallback, useCallback, useRef } from 'react';

const usePopper = () => {
  const referenceRef = useRef<HTMLElement | null>();
  const popperRef = useRef<HTMLElement | null>();

  if (isProduction) {
    // eslint-disable-next-line no-console
    console.log(1);
  }

  const update = useCallback(() => {
    if (!referenceRef.current || !popperRef) {
      // eslint-disable-next-line no-console
      console.log(1);
    }
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

  return {
    reference: setReference,
    popper: setPopper,
  };
};

export default usePopper;
