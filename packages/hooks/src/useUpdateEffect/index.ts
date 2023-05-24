import { useEffect } from 'react';
import useIsFirstMount from '../useIsFirstMount';

const useUpdateEffect: typeof useEffect = (effect, deps) => {
  const isFirstMount = useIsFirstMount();

  useEffect(() => {
    if (!isFirstMount) {
      return effect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useUpdateEffect;
