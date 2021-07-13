import React from 'react';
import ROP from 'resize-observer-polyfill';
import useForkRef from '../hooks/useForkRef';
import { isDevelopment } from '../utils/env';
import findDomNode from '../utils/findDomNode';

export type ResizeObserverProps = {
  children: React.ReactElement;
  onResize: (props: { width: number; height: number }, element: HTMLElement) => void;
};

const displayName = 'ResizeObserver';

const ResizeObserver = React.forwardRef<HTMLElement, ResizeObserverProps>((props, ref) => {
  const { children, onResize } = props;

  const domRef = React.useRef<HTMLElement>();

  const elementRef = React.useRef<HTMLElement | null>();

  const forkRef = useForkRef(ref, domRef);

  const resizeObserverRef = React.useRef<ResizeObserver>();

  const handleResize: ResizeObserverCallback = React.useCallback(
    (entries: Array<ResizeObserverEntry>) => {
      const target = entries[0].target as HTMLElement;

      const { width, height } = target.getBoundingClientRect();

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
    const element: HTMLElement | null = findDomNode(domRef.current);
    if (element !== elementRef.current) {
      destroyObserver();
      elementRef.current = element;
    }
    if (!resizeObserverRef.current && element) {
      const observer = new ROP(handleResize);
      observer.observe(element);
      resizeObserverRef.current = observer;
    }
  }, [destroyObserver, handleResize]);

  React.useEffect(() => {
    createOrUpdateObserver();
    return () => {
      destroyObserver();
    };
  }, [children, createOrUpdateObserver, destroyObserver]);

  return React.cloneElement(children, {
    ref: forkRef,
  });
});

if (isDevelopment) {
  ResizeObserver.displayName = displayName;
  ResizeObserver.propTypes = {};
}

export default ResizeObserver;
