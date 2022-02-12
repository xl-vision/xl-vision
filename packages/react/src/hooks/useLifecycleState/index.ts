import { useLayoutEffect } from '@xl-vision/hooks';
import { useRef } from 'react';

export enum LifecycleState {
  BEFORE_MOUNTED,
  MOUNTED,
  DESTORYED,
}

const useLifecycleState = () => {
  const stateRef = useRef(LifecycleState.BEFORE_MOUNTED);

  useLayoutEffect(() => {
    stateRef.current = LifecycleState.MOUNTED;
    return () => {
      stateRef.current = LifecycleState.DESTORYED;
    };
  }, []);

  return stateRef;
};

export default useLifecycleState;
