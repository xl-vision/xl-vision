import React from 'react';
import { useLayoutEffect } from '@xl-vision/hooks';

export enum LifecycleState {
  BEFORE_MOUNTED,
  MOUNTED,
  DESTORYED,
}

const useLifecycleState = () => {
  const stateRef = React.useRef(LifecycleState.BEFORE_MOUNTED);

  useLayoutEffect(() => {
    stateRef.current = LifecycleState.MOUNTED;
    return () => {
      stateRef.current = LifecycleState.DESTORYED;
    };
  }, []);

  return stateRef;
};

export default useLifecycleState;
