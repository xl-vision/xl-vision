import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { isProduction, warning } from '@xl-vision/utils';
import { useConstantFn, useLayoutEffect, useForkRef } from '@xl-vision/hooks';
import useLifecycleState, { LifecycleState } from '../hooks/useLifecycleState';
import findDomNode from '../utils/findDomNode';
import { supportRef } from '../utils/ref';

enum TransitionState {
  STATE_ENTERING, // 0
  STATE_ENTERED, // 1
  STATE_LEAVING, // 2
  STATE_LEAVED, // 3
}

export type BeforeEventHook = (el: HTMLElement, transitionOnFirst: boolean) => void;
export type EventHook = (
  el: HTMLElement,
  done: () => void,
  isCancelled: () => boolean,
  transitionOnFirst: boolean,
) => void;
export type AfterEventHook = (el: HTMLElement, transitionOnFirst: boolean) => void;
export type EventCancelledHook = (el: HTMLElement, transitionOnFirst: boolean) => void;

export type TransitionProps = {
  beforeEnter?: BeforeEventHook;
  enter?: EventHook;
  afterEnter?: AfterEventHook;
  enterCancelled?: EventCancelledHook;
  beforeLeave?: BeforeEventHook;
  leave?: EventHook;
  afterLeave?: AfterEventHook;
  leaveCancelled?: EventCancelledHook;
  children: React.ReactElement;
  mountOnEnter?: boolean;
  unmountOnLeave?: boolean;
  transitionOnFirst?: boolean;
  in: boolean;
};

const displayName = 'Transition';

const Transition: React.FunctionComponent<TransitionProps> = (props) => {
  const {
    in: inProp,
    // 初次挂载时，如果是进入状态，是否触发appear动画
    transitionOnFirst = false,
    afterEnter,
    afterLeave,
    beforeEnter,
    beforeLeave,
    enter,
    enterCancelled,
    leave,
    leaveCancelled,
    children,
    mountOnEnter,
    unmountOnLeave,
  } = props;

  const transitionOnFirstRef = React.useRef(transitionOnFirst);

  const child = React.Children.only(children);

  warning(!supportRef(child), '<%s>: child does not support ref', displayName);

  const [state, setState] = React.useState(
    inProp
      ? transitionOnFirst
        ? TransitionState.STATE_ENTERING
        : TransitionState.STATE_ENTERED
      : transitionOnFirst
      ? TransitionState.STATE_LEAVING
      : TransitionState.STATE_LEAVED,
  );

  const childRef = React.useRef<React.ReactInstance>();

  const lifecycleStateRef = useLifecycleState();

  const forkRef = useForkRef(
    React.isValidElement(child) ? (child as { ref?: React.Ref<unknown> }).ref : null,
    childRef,
  );

  // 保存回调
  const cbRef = React.useRef<() => void>();

  const onTransitionEnd = useConstantFn(
    (nextState: TransitionState, eventHook?: EventHook, afterEventHook?: AfterEventHook) => {
      // 判断回调是否执行了
      const wrapCallback = () => {
        // wrapCallback可能会在setTimeout中被调用，默认同步setState，这里强制异步处理
        // https://github.com/facebook/react/issues/19013#issuecomment-634777298
        ReactDOM.unstable_batchedUpdates(() => {
          if (!isCancelled() && lifecycleStateRef.current === LifecycleState.MOUNTED) {
            setState(nextState);
            // 必须放在后面，防止其中修改了prop in
            afterEventHook?.(findDomNode(childRef.current), transitionOnFirstRef.current);
            transitionOnFirstRef.current = false;

            // 避免多次触发
            cbRef.current = undefined;
          }
        });
      };

      cbRef.current = wrapCallback;

      const isCancelled = () => wrapCallback !== cbRef.current;

      if (eventHook) {
        eventHook(
          findDomNode(childRef.current),
          wrapCallback,
          isCancelled,
          transitionOnFirstRef.current,
        );
      } else {
        wrapCallback();
      }
    },
  );

  const stateTrigger = useConstantFn((_state: TransitionState) => {
    // 展示
    if (inProp && _state === TransitionState.STATE_ENTERING) {
      beforeEnter?.(findDomNode(childRef.current), transitionOnFirstRef.current);
      onTransitionEnd(TransitionState.STATE_ENTERED, enter, afterEnter);
    } else if (!inProp && _state === TransitionState.STATE_LEAVING) {
      beforeLeave?.(findDomNode(childRef.current), transitionOnFirstRef.current);
      onTransitionEnd(TransitionState.STATE_LEAVED, leave, afterLeave);
    }
  });

  // 必须同步执行，否则可能由于浏览器性能问题，导致延后调用，会出现界面一直停留在还没有初始化之前
  useLayoutEffect(() => {
    stateTrigger(state);
  }, [
    state,
    // 以下都是常量
    stateTrigger,
  ]);

  const inPropTrigger = useConstantFn((_inProp: boolean) => {
    const el: HTMLElement = findDomNode(childRef.current);
    if (
      _inProp &&
      (state === TransitionState.STATE_LEAVING || state === TransitionState.STATE_LEAVED)
    ) {
      cbRef.current = undefined;
      // 新的更改，之前的event取消
      setState(TransitionState.STATE_ENTERING);

      if (state === TransitionState.STATE_LEAVING) {
        leaveCancelled?.(el, transitionOnFirstRef.current);
        transitionOnFirstRef.current = false;
      }
    } else if (
      !_inProp &&
      (state === TransitionState.STATE_ENTERING || state === TransitionState.STATE_ENTERED)
    ) {
      cbRef.current = undefined;
      setState(TransitionState.STATE_LEAVING);
      if (state === TransitionState.STATE_ENTERING) {
        enterCancelled?.(el, transitionOnFirstRef.current);
        transitionOnFirstRef.current = false;
      }
    }
  });

  // 保证动画立即开始
  useLayoutEffect(() => {
    inPropTrigger(inProp);
  }, [
    inProp,
    // 以下都是常量
    inPropTrigger,
  ]);

  const display = state !== TransitionState.STATE_LEAVED;

  // 判断是否是第一次挂载
  const isFirstMountRef = React.useRef(true);

  if (inProp) {
    isFirstMountRef.current = false;
  }

  if (isFirstMountRef.current) {
    if (mountOnEnter && !display) {
      return null;
    }
  } else if (unmountOnLeave && !display) {
    return null;
  }

  return React.cloneElement(child, {
    ...(child as { props?: {} }).props,
    ref: forkRef,
  });
};

if (!isProduction) {
  Transition.displayName = displayName;

  Transition.propTypes = {
    beforeEnter: PropTypes.func,
    enter: PropTypes.func,
    afterEnter: PropTypes.func,
    enterCancelled: PropTypes.func,
    beforeLeave: PropTypes.func,
    leave: PropTypes.func,
    afterLeave: PropTypes.func,
    leaveCancelled: PropTypes.func,
    children: PropTypes.element.isRequired,
    mountOnEnter: PropTypes.bool,
    unmountOnLeave: PropTypes.bool,
    transitionOnFirst: PropTypes.bool,
    in: PropTypes.bool.isRequired,
  };
}

export default Transition;
