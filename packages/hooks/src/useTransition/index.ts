import { warning } from '@xl-vision/utils';
import { ReactInstance, RefCallback, useCallback, useRef, useState } from 'react';
// eslint-disable-next-line camelcase
import { findDOMNode } from 'react-dom';
import useConstantFn from '../useConstantFn';
import useIsomorphicLayoutEffect from '../useIsomorphicLayoutEffect';

export type TransitionStartHook<T extends Element = Element> = (
  el: T,
  transitionOnFirst: boolean,
) => void;
export type TransitionStartingHook<T extends Element = Element> = (
  el: T,
  done: () => void,
  transitionOnFirst: boolean,
  isCancelled: () => boolean,
) => void;
export type TransitionEndHook<T extends Element = Element> = (
  el: T,
  transitionOnFirst: boolean,
) => void;
export type TransitionCancelledHook<T extends Element = Element> = (
  el: T,
  transitionOnFirst: boolean,
) => void;

export type TransitionOptions<T extends Element = Element> = {
  onEnter?: TransitionStartHook<T>;
  onEntering?: TransitionStartingHook<T>;
  onEntered?: TransitionEndHook<T>;
  onEnterCancelled?: TransitionCancelledHook<T>;
  onExit?: TransitionStartHook<T>;
  onExiting?: TransitionStartingHook<T>;
  onExited?: TransitionEndHook<T>;
  onExitCancelled?: TransitionCancelledHook<T>;

  in: boolean;
  transitionOnFirst?: boolean;
};

const useTransition = <T extends Element = Element>(options: TransitionOptions<T>) => {
  const {
    onEnter,
    onEntering,
    onEntered,
    onExit,
    onExiting,
    onExited,
    onEnterCancelled,
    onExitCancelled,
    in: inOption,
    transitionOnFirst = false,
  } = options;

  const elementRef = useRef<T | null>();

  const transitionOnFirstRef = useRef(transitionOnFirst);

  // 是否处于enter和exited之间的状态
  const [inTransition, setInTransition] = useState(transitionOnFirst);

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
      el: T,
      startHook: TransitionStartHook<T> | undefined,
      startingHook: TransitionStartingHook<T> | undefined,
      endHook: TransitionEndHook<T> | undefined,
      cancelHook: TransitionCancelledHook<T> | undefined,
    ) => {
      const isFirst = transitionOnFirstRef.current;

      transitionOnFirstRef.current = false;

      // 判断回调是否执行了
      const wrapCallback = () => {
        if (isDestoryedRef.current) {
          return;
        }
        if (isCancelled()) {
          return;
        }
        // 避免多次触发
        cbRef.current = undefined;
        endHook?.(el, isFirst);
      };

      const cancelCallback = () => {
        if (isDestoryedRef.current) {
          return;
        }
        cancelHook?.(el, isFirst);
      };

      cbRef.current?.();

      cbRef.current = cancelCallback;

      const isCancelled = () => cancelCallback !== cbRef.current;

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

  const handleInOptionChange = useConstantFn((value: boolean) => {
    const isFirst = isFirstUpdateRef.current;
    isFirstUpdateRef.current = false;

    if (!transitionOnFirstRef.current && isFirst) {
      return;
    }

    const el = elementRef.current;

    if (!el) {
      warning(!el, 'useTransition: element is not found');
      return;
    }

    if (value) {
      onTransitionEnd(
        el,
        (elOption, transitionOnFirstOption) => {
          setInTransition(true);
          onEnter?.(elOption, transitionOnFirstOption);
        },
        onEntering,
        onEntered,
        onEnterCancelled,
      );
    } else {
      onTransitionEnd(
        el,
        onExit,
        onExiting,
        (elOption, transitionOnFirstOption) => {
          setInTransition(false);
          onExited?.(elOption, transitionOnFirstOption);
        },
        onExitCancelled,
      );
    }
  });

  useIsomorphicLayoutEffect(() => {
    handleInOptionChange(inOption);
  }, [inOption, handleInOptionChange]);

  const nodeRef: RefCallback<ReactInstance> = useCallback((el) => {
    // eslint-disable-next-line react/no-find-dom-node
    elementRef.current = findDOMNode(el) as T | null;
  }, []);

  // 是否展示
  const show = inTransition || inOption;

  return {
    show,
    nodeRef,
  };
};

export default useTransition;
