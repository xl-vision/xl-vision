import { useRef } from 'react';
import useIsomorphicLayoutEffect from '../useIsomorphicLayoutEffect';

export enum LifecycleState {
  BEFORE_MOUNTED,
  MOUNTED,
  DESTORYED,
}

const useLifecycleState = () => {
  const stateRef = useRef(LifecycleState.BEFORE_MOUNTED);

  useIsomorphicLayoutEffect(() => {
    stateRef.current = LifecycleState.MOUNTED;
    return () => {
      stateRef.current = LifecycleState.DESTORYED;
    };
  }, []);

  return stateRef;
};

export default useLifecycleState;
