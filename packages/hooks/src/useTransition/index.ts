import { ReactInstance, RefCallback, useCallback, useRef } from 'react';
// eslint-disable-next-line camelcase
import { findDOMNode, unstable_batchedUpdates } from 'react-dom';
import useIsomorphicLayoutEffect from '../useIsomorphicLayoutEffect';

export type TransitionStartHook = (el: Element, transitionOnFirst: boolean) => void;
export type TransitionStartingHook = (
  el: Element,
  done: () => void,
  transitionOnFirst: boolean,
  isCancelled: () => boolean,
) => void;
export type TransitionEndHook = (el: Element, transitionOnFirst: boolean) => void;

export type TransitionOptions = {
  onEnter?: TransitionStartHook;
  onEntering?: TransitionStartingHook;
  onEntered?: TransitionEndHook;
  onLeave?: TransitionStartHook;
  onLeaving?: TransitionStartingHook;
  onLeaved?: TransitionEndHook;

  in: boolean;
  transitionOnFirst?: boolean;
};

const useTransition = (options: TransitionOptions) => {
  const {
    onEnter,
    onEntering,
    onEntered,
    onLeave,
    onLeaving,
    onLeaved,
    in: inOption,
    transitionOnFirst = false,
  } = options;

  const elementRef = useRef<Element | null>();

  const transitionOnFirstRef = useRef(transitionOnFirst);

  // 保存回调
  const cbRef = useRef<() => void>();

  const isDestoryedRef = useRef(false);

  useIsomorphicLayoutEffect(() => {
    return () => {
      isDestoryedRef.current = true;
    };
  }, []);

  const onTransitionEnd = useCallback(
    (
      el: Element,
      startHook: TransitionStartHook | undefined,
      startingHook: TransitionStartingHook | undefined,
      endHook: TransitionEndHook | undefined,
    ) => {
      const isFirst = transitionOnFirstRef.current;

      transitionOnFirstRef.current = false;

      // 判断回调是否执行了
      const wrapCallback = () => {
        // wrapCallback可能会在setTimeout中被调用，默认同步setState，这里强制异步处理
        // https://github.com/facebook/react/issues/19013#issuecomment-634777298
        unstable_batchedUpdates(() => {
          if (!isCancelled() && !isDestoryedRef.current) {
            // 避免多次触发
            cbRef.current = undefined;
            endHook?.(el, isFirst);
          }
        });
      };

      cbRef.current = wrapCallback;

      const isCancelled = () => wrapCallback !== cbRef.current;

      startHook?.(el, isFirst);
      if (startingHook) {
        startingHook(el, wrapCallback, isFirst, isCancelled);
      } else {
        wrapCallback();
      }
    },
    [],
  );

  const isFirstUpdateRef = useRef(true);

  useIsomorphicLayoutEffect(() => {
    const el = elementRef.current;

    if (!el) {
      return;
    }

    const isFirst = isFirstUpdateRef.current;
    isFirstUpdateRef.current = false;

    if (!transitionOnFirstRef.current && isFirst) {
      return;
    }

    if (inOption) {
      onTransitionEnd(el, onEnter, onEntering, onEntered);
    } else {
      onTransitionEnd(el, onLeave, onLeaving, onLeaved);
    }
  }, [inOption, onTransitionEnd]);

  const nodeRef: RefCallback<ReactInstance> = useCallback((el) => {
    // eslint-disable-next-line react/no-find-dom-node
    elementRef.current = findDOMNode(el) as Element | null;
  }, []);

  return {
    nodeRef,
    transitionOnFirst: transitionOnFirstRef.current,
  };
};

export default useTransition;
