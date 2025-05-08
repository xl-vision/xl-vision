import { useConstantFn, useForkRef, useResizeObserver } from '@xl-vision/hooks';
import { raf } from '@xl-vision/utils';
import { useState, useRef, useEffect } from 'react';
import { flushSync } from 'react-dom';

const useOverflow = <T extends Element>({ value }: { value: string }) => {
  const [overflow, setOverflow] = useState(false);

  const elRef = useRef<T>(null);

  const rafCancelFnRef = useRef<() => void>(null);

  const handleOverflow = useConstantFn(() => {
    rafCancelFnRef.current?.();

    rafCancelFnRef.current = raf(() => {
      const el = elRef.current;

      if (!el) {
        return;
      }

      const height = el.clientHeight;

      const computedStyle = getComputedStyle(el);

      const paddingTop = parseFloat(computedStyle.paddingTop);
      const paddingBottom = parseFloat(computedStyle.paddingBottom);

      const children = el.childNodes;
      let totalHeight = 0;

      children.forEach((child) => {
        totalHeight += (child as HTMLElement).clientHeight;
      });

      flushSync(() => {
        setOverflow(height < totalHeight + paddingTop + paddingBottom);
      });
    });
  });

  const resizeRef = useResizeObserver<T>(handleOverflow);

  const forkRef = useForkRef(elRef, resizeRef);

  useEffect(() => {
    handleOverflow();
  }, [value, handleOverflow]);

  useEffect(() => {
    return () => {
      rafCancelFnRef.current?.();
    };
  }, []);

  return { overflow, ref: forkRef };
};

export default useOverflow;
