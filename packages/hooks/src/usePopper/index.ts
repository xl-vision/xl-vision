import { RefCallback, useCallback } from 'react';

const usePopper = () => {
  const update = useCallback(() => {}, []);

  const setReference: RefCallback<HTMLElement> = useCallback((el) => {}, []);
  const setPopper: RefCallback<HTMLElement> = useCallback((el) => {}, []);

  return {
    reference: setReference,
    popper: setPopper,
  };
};

export default usePopper;
