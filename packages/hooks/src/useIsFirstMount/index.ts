import { useRef } from 'react';
import useIsomorphicLayoutEffect from '../useIsomorphicLayoutEffect';

/**
 * check if the first mount
 */
const useIsFirstMount = () => {
  const isFirst = useRef(true);

  useIsomorphicLayoutEffect(() => {
    isFirst.current = false;
  }, []);

  return isFirst.current;
};

export default useIsFirstMount;
