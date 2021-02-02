import React from 'react';
import useLayoutEffect from '../useLayoutEffect';

const useIsMounted = () => {
  const ref = React.useRef(false);
  const get = React.useCallback(() => ref.current, []);
  useLayoutEffect(() => {
    ref.current = true;
    return () => {
      ref.current = false;
    };
  }, []);
  return get;
};

export default useIsMounted;
