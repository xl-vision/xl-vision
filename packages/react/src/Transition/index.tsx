import PropTypes from 'prop-types';
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactDOM from 'react-dom';
import useIsMounted from '../hooks/useIsMounted';
import useEventCallback from '../hooks/useEventCallback';
import useLayoutEffect from '../hooks/useLayoutEffect';
import useForkRef from '../hooks/useForkRef';

enum State {
  STATE_ENTERING, // 1
  STATE_ENTERED, // 2
  STATE_LEAVING, // 3
  STATE_LEAVED, // 4
}

export type BeforeEventHook = (el: HTMLElement) => void;
export type EventHook = (el: HTMLElement, done: () => void, isCancelled: () => boolean) => void;
export type AfterEventHook = (el: HTMLElement) => void;
export type EventCancelledHook = (el: HTMLElement) => void;

export interface TransitionProps {
  beforeAppear?: BeforeEventHook;
  appear?: EventHook;
  afterAppear?: AfterEventHook;
  appearCancelled?: EventCancelledHook;
  beforeEnter?: BeforeEventHook;
  enter?: EventHook;
  afterEnter?: AfterEventHook;
  enterCancelled?: EventCancelledHook;
  beforeLeave?: BeforeEventHook;
  leave?: EventHook;
  afterLeave?: AfterEventHook;
  leaveCancelled?: EventCancelledHook;
  beforeDisappear?: BeforeEventHook;
  disappear?: EventHook;
  afterDisappear?: AfterEventHook;
  disappearCancelled?: EventCancelledHook;
  children: React.ReactElement;
  mountOnEnter?: boolean;
  unmountOnLeave?: boolean;
  transitionOnFirst?: boolean;
  in: boolean;
}

const Transition: React.FunctionComponent<TransitionProps> = (props) => {
  const {
    in: inProp,
    // 初次挂载时，如果是进入状态，是否触发appear动画
    transitionOnFirst,
    afterEnter,
    afterLeave,
    beforeEnter,
    beforeLeave,
    enter,
    enterCancelled,
    leave,
    leaveCancelled,
    beforeAppear: _beforeAppear,
    appear: _appear,
    appearCancelled: _appearCancelled,
    afterAppear: _afterAppear,
    beforeDisappear: _beforeDisappear,
    disappear: _disappear,
    afterDisappear: _afterDisappear,
    disappearCancelled: _disappearCancelled,
    children,
    mountOnEnter,
    unmountOnLeave,
  } = props;

  const isFirstTransitionRef = React.useRef(transitionOnFirst);

  // 如果开启transitionOnFirst,默认使用enter和leave的生命周期方法
  const appear = _appear || enter;
  const disappear = _disappear || leave;
  const beforeAppear = _beforeAppear || beforeEnter;
  const beforeDisappear = _beforeDisappear || beforeLeave;

  const afterAppear = useEventCallback((el: HTMLElement) => {
    const fn = _afterAppear || afterEnter;
    fn && fn(el);
    isFirstTransitionRef.current = false;
  });

  const appearCancelled = useEventCallback((el: HTMLElement) => {
    const fn = _appearCancelled || enterCancelled;
    fn && fn(el);
    isFirstTransitionRef.current = false;
  });
  const afterDisappear = useEventCallback((el: HTMLElement) => {
    const fn = _afterDisappear || afterLeave;
    fn && fn(el);
    isFirstTransitionRef.current = false;
  });

  const disappearCancelled = useEventCallback((el: HTMLElement) => {
    const fn = _disappearCancelled || leaveCancelled;
    fn && fn(el);
    isFirstTransitionRef.current = false;
  });

  const [state, setState] = React.useState(
    inProp
      ? transitionOnFirst
        ? State.STATE_ENTERING
        : State.STATE_ENTERED
      : transitionOnFirst
      ? State.STATE_LEAVING
      : State.STATE_LEAVED,
  );

  // 标记当前组件是否被卸载
  const mountStateCallback = useIsMounted();

  const childrenNodeRef = React.useRef<HTMLElement>();

  const child = React.Children.only(children);

  const forkRef = useForkRef(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    React.isValidElement(child) ? (child as any).ref : null,
    childrenNodeRef,
  );

  // 保存回调
  const cbRef = React.useRef<() => void>();

  const onTransitionEnd = useEventCallback(
    (nextState: State, eventHook?: EventHook, afterEventHook?: AfterEventHook) => {
      const afterEventHookWrap = () => afterEventHook && afterEventHook(childrenNodeRef.current!);
      cbRef.current = afterEventHookWrap;

      const isCancelled = () => afterEventHookWrap !== cbRef.current;
      // 判断回调是否执行了
      const wrapCallback = () => {
        // wrapCallback可能会在setTimeout中被调用，默认同步setState，这里强制异步处理
        // https://github.com/facebook/react/issues/19013#issuecomment-634777298
        ReactDOM.unstable_batchedUpdates(() => {
          if (!isCancelled() && mountStateCallback()) {
            setState(nextState);
            // 必须放在后面，防止其中修改了prop in
            afterEventHookWrap();
            // 避免多次触发
            cbRef.current = undefined;
          }
        });
      };
      if (eventHook) {
        eventHook(childrenNodeRef.current!, wrapCallback, isCancelled);
      } else {
        wrapCallback();
      }
    },
  );

  const stateTrigger = useEventCallback((_state: State) => {
    // 展示
    if (inProp) {
      if (_state === State.STATE_ENTERING) {
        const beforeHook = isFirstTransitionRef.current ? beforeAppear : beforeEnter;
        const hook = isFirstTransitionRef.current ? appear : enter;
        const afterHook = isFirstTransitionRef.current ? afterAppear : afterEnter;
        beforeHook && beforeHook(childrenNodeRef.current!);
        onTransitionEnd(State.STATE_ENTERED, hook, afterHook);
      }
    } else if (_state === State.STATE_LEAVING) {
      const beforeHook = isFirstTransitionRef.current ? beforeDisappear : beforeLeave;
      const hook = isFirstTransitionRef.current ? disappear : leave;
      const afterHook = isFirstTransitionRef.current ? afterDisappear : afterLeave;
      beforeHook && beforeHook(childrenNodeRef.current!);
      onTransitionEnd(State.STATE_LEAVED, hook, afterHook);
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

  const inPropTrigger = useEventCallback((_inProp: boolean) => {
    if (_inProp && state >= State.STATE_LEAVING) {
      // 不能放到外面，会使appear和disappear失效
      cbRef.current = undefined;
      // 新的更改，之前的event取消
      setState(State.STATE_ENTERING);

      if (state === State.STATE_LEAVING) {
        const cancelledHook = isFirstTransitionRef.current ? disappearCancelled : leaveCancelled;
        cancelledHook && cancelledHook(childrenNodeRef.current!);
      }
    } else if (!_inProp && state < State.STATE_LEAVING) {
      cbRef.current = undefined;
      setState(State.STATE_LEAVING);
      if (state === State.STATE_ENTERING) {
        const cancelledHook = isFirstTransitionRef.current ? appearCancelled : enterCancelled;
        cancelledHook && cancelledHook(childrenNodeRef.current!);
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

  const display = state !== State.STATE_LEAVED;

  // 判断是否是第一次挂载
  const isFirstMountRef = React.useRef(true);

  if (transitionOnFirst || inProp) {
    isFirstMountRef.current = false;
  }

  if (isFirstMountRef.current) {
    if (mountOnEnter && !display) {
      return null;
    }
  } else if (unmountOnLeave && !display) {
    return null;
  }

  const style: React.CSSProperties = {
    ...(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>).props.style,
  };
  if (!display) {
    style.display = 'none';
  }

  return React.cloneElement(child, {
    ...children.props,
    ref: forkRef,
    style,
  });
};

Transition.displayName = 'Transition';

Transition.propTypes = {
  beforeAppear: PropTypes.func,
  appear: PropTypes.func,
  afterAppear: PropTypes.func,
  appearCancelled: PropTypes.func,
  beforeEnter: PropTypes.func,
  enter: PropTypes.func,
  afterEnter: PropTypes.func,
  enterCancelled: PropTypes.func,
  beforeLeave: PropTypes.func,
  leave: PropTypes.func,
  afterLeave: PropTypes.func,
  leaveCancelled: PropTypes.func,
  beforeDisappear: PropTypes.func,
  disappear: PropTypes.func,
  afterDisappear: PropTypes.func,
  disappearCancelled: PropTypes.func,
  children: PropTypes.element.isRequired,
  mountOnEnter: PropTypes.bool,
  unmountOnLeave: PropTypes.bool,
  transitionOnFirst: PropTypes.bool,
  in: PropTypes.bool.isRequired,
};

export default Transition;
