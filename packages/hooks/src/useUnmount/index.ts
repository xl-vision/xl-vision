import { useEffect } from 'react';
import useConstantFn from '../useConstantFn';

export default (cb: () => void) => {
  const constantCb = useConstantFn(cb);

  useEffect(() => {
    return () => {
      constantCb();
    };
  }, [constantCb]);
};
