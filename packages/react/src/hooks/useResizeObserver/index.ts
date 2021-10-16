import React from 'react';
import ROP from 'resize-observer-polyfill';
import { useConstantFn } from '@xl-vision/hooks';

export type ResizeObserverHandler<T extends HTMLElement> = (
  state: { width: number; height: number },
  target: T,
) => void;

export default <T extends HTMLElement>(onResizeObserver: ResizeObserverHandler<T>) => {
  const resizeObserverRef = React.useRef<ResizeObserver>();
  const prevElementRef = React.useRef<T | null>();
  const widthRef = React.useRef<number>();
  const heightRef = React.useRef<number>();

  const handleResizeObserver: ResizeObserverCallback = useConstantFn(
    (entries: Array<ResizeObserverEntry>) => {
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
        .catch(() => {});
    },
  );

  const refCallback: React.RefCallback<T> = React.useCallback(
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

  React.useEffect(() => {
    return () => {
      resizeObserverRef.current?.disconnect();
    };
  }, []);

  return refCallback;
};
