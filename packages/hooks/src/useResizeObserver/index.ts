import { RefCallback, useCallback, useRef } from 'react';
import ROP from 'resize-observer-polyfill';
import useConstantFn from '../useConstantFn';

export type ResizeObserverHandler<T extends Element = Element> = (
  state: { width: number; height: number },
  target: T,
) => void;

const useResizeObserver = <T extends Element>(onResizeObserver: ResizeObserverHandler<T>) => {
  const resizeObserverRef = useRef<ResizeObserver>();
  const prevElementRef = useRef<T | null>();
  const widthRef = useRef<number>();
  const heightRef = useRef<number>();

  const handleResizeObserver: ResizeObserverCallback = useConstantFn((entries) => {
    if (!entries.length) {
      return;
    }
    const entry = entries[0];

    const target = entry.target as T;

    const { width, height } = entry.contentRect;

    const fixedWidth = Math.round(width);
    const fixedHeight = Math.round(height);

    if (widthRef.current === fixedWidth && heightRef.current === fixedHeight) {
      return;
    }

    Promise.resolve()
      .then(() => {
        onResizeObserver({ width: fixedWidth, height: fixedHeight }, target);
      })
      .catch(console.error);
  });

  const refCallback: RefCallback<T> = useCallback(
    (el) => {
      if (prevElementRef.current === el) {
        return;
      }
      if (prevElementRef.current && resizeObserverRef.current) {
        resizeObserverRef.current.unobserve(prevElementRef.current);
      }
      prevElementRef.current = el;

      if (!el) {
        return;
      }

      const resizeObserver = resizeObserverRef.current || new ROP(handleResizeObserver);

      resizeObserver.observe(el);

      resizeObserverRef.current = resizeObserver;
    },
    [handleResizeObserver],
  );

  return refCallback;
};

export default useResizeObserver;
