import { warning } from '@xl-vision/utils';
import { ReactInstance, RefCallback, useCallback, useRef, useState } from 'react';

import { findDOMNode } from 'react-dom';
import useConstantFn from '../useConstantFn';
import useIsFirstMount from '../useIsFirstMount';
import useIsomorphicLayoutEffect from '../useIsomorphicLayoutEffect';
import useLifecycleState, { LifecycleState } from '../useLifecycleState';

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

export type TransitionOptions<T extends Element> = {
  in: boolean;
  onEnter?: TransitionStartHook<T>;
  onEnterCancelled?: TransitionCancelledHook<T>;
  onEntered?: TransitionEndHook<T>;
  onEntering?: TransitionStartingHook<T>;
  onExit?: TransitionStartHook<T>;
  onExitCancelled?: TransitionCancelledHook<T>;
  onExited?: TransitionEndHook<T>;
  onExiting?: TransitionStartingHook<T>;
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

  // 保存回调
  const cbRef = useRef<() => void>();

  const lifecycleStatRef = useLifecycleState();

  const doTransition = useCallback(
    (
      el: T,
      isFirst: boolean,
      startHook: TransitionStartHook<T> | undefined,
      startingHook: TransitionStartingHook<T> | undefined,
      endHook: TransitionEndHook<T> | undefined,
      cancelHook: TransitionCancelledHook<T> | undefined,
    ) => {
      // 判断回调是否执行了
      const wrapCallback = () => {
        if (isCancelled()) {
          return;
        }
        // 避免多次触发
        cbRef.current = undefined;
        endHook?.(el, isFirst);
      };

      const cancelCallback = () => {
        if (lifecycleStatRef.current === LifecycleState.DESTORYED) {
          return;
        }
        cancelHook?.(el, isFirst);
      };

      cbRef.current?.();

      cbRef.current = cancelCallback;

      const isCancelled = () =>
        lifecycleStatRef.current === LifecycleState.DESTORYED || cancelCallback !== cbRef.current;

      startHook?.(el, isFirst);
      if (startingHook) {
        startingHook(el, wrapCallback, isFirst, isCancelled);
      } else {
        wrapCallback();
      }
    },
    [lifecycleStatRef],
  );

  const elementRef = useRef<T | null>();

  // 是否处于enter和exited之间的状态，只要children在显示中，就为true
  const [inTransition, setInTransition] = useState(inOption || transitionOnFirst);

  const isFirstUpdate = useIsFirstMount();
  const transitionOnFirstRef = useRef(transitionOnFirst);

  const handleInOptionChange = useConstantFn((value: boolean) => {
    const isTransitionOnFirst = transitionOnFirstRef.current;

    transitionOnFirstRef.current = false;

    if (!isTransitionOnFirst && isFirstUpdate) {
      return;
    }

    const el = elementRef.current;

    if (!el) {
      warning(!el, 'useTransition: element is not found');
      return;
    }

    if (value) {
      doTransition(
        el,
        isTransitionOnFirst,
        (elOption, transitionOnFirstOption) => {
          setInTransition(true);
          onEnter?.(elOption, transitionOnFirstOption);
        },
        onEntering,
        onEntered,
        onEnterCancelled,
      );
    } else {
      doTransition(
        el,
        isTransitionOnFirst,
        onExit,
        onExiting,
        (elOption, transitionOnFirstOption) => {
          onExited?.(elOption, transitionOnFirstOption);
          if (lifecycleStatRef.current !== LifecycleState.DESTORYED) {
            setInTransition(false);
          }
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
