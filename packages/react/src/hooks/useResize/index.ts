import findDomNode from '@xl-vision/react/utils/findDomNode';
import React from 'react';
import ROP from 'resize-observer-polyfill';

export default <T extends HTMLElement>(
  ref: React.RefObject<T>,
  onResize: (state: { width: number; height: number }, target: T) => void,
) => {
  const resizeObserverRef = React.useRef<ResizeObserver>();
  const elementRef = React.useRef<HTMLElement | null>();

  const handleResize: ResizeObserverCallback = React.useCallback(
    (entries: Array<ResizeObserverEntry>) => {
      const entry = entries[0];
      const target = entry.target as T;

      const { width, height } = entry.contentRect;

      if (onResize) {
        // defer the callback but not defer to next frame
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        Promise.resolve().then(() => {
          onResize(
            {
              width,
              height,
            },
            target,
          );
        });
      }
    },
    [onResize],
  );

  const destroyObserver = React.useCallback(() => {
    const observer = resizeObserverRef.current;
    if (observer) {
      observer.disconnect();
      resizeObserverRef.current = undefined;
    }
  }, []);

  const createOrUpdateObserver = React.useCallback(() => {
    const element: HTMLElement | null = findDomNode(ref.current);
    if (element !== elementRef.current) {
      destroyObserver();
      elementRef.current = element;
    }
    if (!resizeObserverRef.current && element) {
      const observer = new ROP(handleResize);
      observer.observe(element);
      resizeObserverRef.current = observer;
    }
  }, [destroyObserver, handleResize, ref]);

  React.useEffect(() => {
    createOrUpdateObserver();
    return () => {
      destroyObserver();
    };
  }, [createOrUpdateObserver, destroyObserver]);

  React.useEffect(() => {
    createOrUpdateObserver();
  });
};
