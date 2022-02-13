import { useRef } from 'react';

/**
 * https://github.com/facebook/react/issues/14099#issuecomment-440013892
 * 将给定的函数常量化
 * @param value
 */
const useConstantFn = <P extends Array<any>, R extends any>(fn: (...args: P) => R) => {
  const fnRef = useRef<(...args: P) => R>(fn);

  fnRef.current = fn;

  const constantFnRef = useRef<(...args: P) => R>();

  if (!constantFnRef.current) {
    constantFnRef.current = (...args: P) => fnRef.current(...args);
  }

  return constantFnRef.current;
};

export default useConstantFn;
