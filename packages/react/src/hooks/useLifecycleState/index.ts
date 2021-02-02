import React from 'react';
import useLayoutEffect from '../useLayoutEffect';

export enum LifecycleState {
  BEFORE_MOUNTED,
  MOUNTED,
  DESTORYED,
}

export default () => {
  const stateRef = React.useRef(LifecycleState.BEFORE_MOUNTED);

  useLayoutEffect(() => {
    stateRef.current = LifecycleState.MOUNTED;
    return () => {
      stateRef.current = LifecycleState.DESTORYED;
    };
  }, []);

  return stateRef;
};
