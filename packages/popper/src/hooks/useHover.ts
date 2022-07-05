import { useCallback } from 'react';
import { InteractionHook } from '../useInteractions';

const useHover = () => {
  const cb: InteractionHook = useCallback(({ reference, popper, update }) => {
    return {
      reference: {},
      popper: {},
    };
  }, []);

  return cb;
};

export default useHover;
