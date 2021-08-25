import React from 'react';
import useLayoutEffect from '../useLayoutEffect';

/**
 * https://github.com/facebook/react/issues/14099#issuecomment-440013892
 * 将给定的函数常量化
 * hook返回的方法只能在commit后调用，否则可能会出现获取到的方法不是最新的
 * @param value
 */
const useEventCallback = <P extends Array<any>, R extends any>(fn: (...args: P) => R) => {
  const fnRef = React.useRef<(...args: P) => R>(fn);
  const getValue = React.useCallback((...args: P) => fnRef.current(...args), []);

  useLayoutEffect(() => {
    fnRef.current = fn;
  });

  return getValue;
};

export default useEventCallback;
