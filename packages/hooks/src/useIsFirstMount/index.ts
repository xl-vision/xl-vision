import { useRef } from 'react';

/**
 * check if the first mount
 */
const useIsFirstMount = () => {
  const isFirst = useRef(true);

  if (isFirst.current) {
    isFirst.current = false;

    return true;
  }

  return isFirst.current;
};

export default useIsFirstMount;
