import { useRef } from 'react';
import useLatestRef from '../useLatestRef';

/**
 * https://github.com/facebook/react/issues/14099#issuecomment-440013892
 * 将给定的函数常量化
 * @param value
 */
const useConstantFn = <Fn extends (...args: any) => any>(fn: Fn) => {
  const fnRef = useLatestRef(fn);

  const constantFnRef = useRef<Fn>();

  if (!constantFnRef.current) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument
    constantFnRef.current = ((...args: any) => fnRef.current(...args)) as Fn;
  }

  return constantFnRef.current;
};

export default useConstantFn;
