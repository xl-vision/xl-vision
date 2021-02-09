import PropTypes from 'prop-types';
import React from 'react';
import { addClass, removeClass } from '../utils/class';
import { nextFrame, onTransitionEnd } from '../utils/transition';
import Transition, {
  AfterEventHook,
  BeforeEventHook,
  EventCancelledHook,
  EventHook,
  TransitionProps,
} from '../Transition';

export type CSSTransitionClassesObject = {
  appear?: string;
  appearActive?: string;
  appearTo?: string;
  appearDone?: string;
  enter?: string;
  enterActive?: string;
  enterTo?: string;
  enterDone?: string;
  leave?: string;
  leaveActive?: string;
  leaveTo?: string;
  leaveDone?: string;
  disappear?: string;
  disappearActive?: string;
  disappearTo?: string;
  disappearDone?: string;
};

export type CSSTransitionClasses = CSSTransitionClassesObject | string;

export type CSSTransitionProps = TransitionProps & {
  disableCss?: boolean;
  transitionClasses?: CSSTransitionClasses;
  timeout?:
    | number
    | {
        appear?: number;
        enter?: number;
        leave?: number;
        disappear?: number;
      };
};

export type TransitionElement = HTMLElement & {
  _ctc?: CSSTransitionClassesObject;
  _done?: (cancel?: boolean) => void;
  _cancelled?: boolean;
  _originalDisplay?: string;
};

const CSSTransition: React.FunctionComponent<CSSTransitionProps> = (props) => {
  const {
    disableCss,
    transitionClasses,
    beforeEnter,
    enter,
    afterEnter,
    enterCancelled,
    beforeLeave,
    leave,
    afterLeave,
    leaveCancelled,
    timeout,
    ...others
  } = props;

  let {
    beforeAppear,
    appear,
    appearCancelled,
    afterAppear,
    beforeDisappear,
    disappear,
    afterDisappear,
    disappearCancelled,
  } = props;

  // 如果开启transitionOnFirst,默认使用enter和leave的生命周期方法
  beforeAppear = beforeAppear || beforeEnter;
  appear = appear || enter;
  afterAppear = afterAppear || afterEnter;
  appearCancelled = appearCancelled || enterCancelled;

  beforeDisappear = beforeDisappear || beforeLeave;
  disappear = disappear || leave;
  afterDisappear = afterDisappear || afterLeave;
  disappearCancelled = disappearCancelled || leaveCancelled;

  const transitionClassesObj = React.useMemo(() => {
    if (!transitionClasses) {
      return {};
    }
    if (typeof transitionClasses === 'object') {
      return transitionClasses;
    }
    return {
      appear: `${transitionClasses}-appear`,
      appearActive: `${transitionClasses}-appear-active`,
      appearTo: `${transitionClasses}-appear-to`,
      appearDone: `${transitionClasses}-appear-done`,
      enter: `${transitionClasses}-enter`,
      enterActive: `${transitionClasses}-enter-active`,
      enterTo: `${transitionClasses}-enter-to`,
      enterDone: `${transitionClasses}-enter-done`,
      leave: `${transitionClasses}-leave`,
      leaveActive: `${transitionClasses}-leave-active`,
      leaveTo: `${transitionClasses}-leave-to`,
      leaveDone: `${transitionClasses}-leave-done`,
      disappear: `${transitionClasses}-disappear`,
      disappearActive: `${transitionClasses}-disappear-active`,
      disappearTo: `${transitionClasses}-disappear-to`,
      disappearDone: `${transitionClasses}-disappear-done`,
    };
  }, [transitionClasses]);

  const timeoutMap = React.useMemo(() => {
    if (!timeout) {
      return {};
    }
    if (typeof timeout === 'object') {
      return timeout;
    }
    return {
      appear: timeout,
      enter: timeout,
      leave: timeout,
      disappear: timeout,
    };
  }, [timeout]);

  const beforeAppearWrapper = React.useMemo(
    () =>
      createBeforeEventHook(
        !disableCss && {
          appear: transitionClassesObj.appear,
          appearActive: transitionClassesObj.appearActive,
        },
        beforeAppear,
      ),
    [disableCss, transitionClassesObj, beforeAppear],
  );

  const appearWrapper = React.useMemo(
    () =>
      createEventHook(
        !disableCss && {
          appearActive: transitionClassesObj.appearActive,
          appearTo: transitionClassesObj.appearTo,
        },
        timeoutMap.appear,
        appear,
      ),
    [disableCss, transitionClassesObj, timeoutMap, appear],
  );
  const afterAppearWrapper = React.useMemo(
    () =>
      createAfterEventHook(
        !disableCss && {
          appearDone: transitionClassesObj.appearDone,
        },
        afterAppear,
      ),
    [disableCss, afterAppear, transitionClassesObj],
  );
  const appearCancelledWrapper = React.useMemo(() => createEventCancelledHook(appearCancelled), [
    appearCancelled,
  ]);

  const beforeEnterWrapper = React.useMemo(
    () =>
      createBeforeEventHook(
        !disableCss && {
          enter: transitionClassesObj.enter,
          enterActive: transitionClassesObj.enterActive,
        },
        beforeEnter,
      ),
    [disableCss, transitionClassesObj, beforeEnter],
  );

  const enterWrapper = React.useMemo(
    () =>
      createEventHook(
        !disableCss && {
          enterTo: transitionClassesObj.enterTo,
          enterActive: transitionClassesObj.enterActive,
        },
        timeoutMap.enter,
        enter,
      ),
    [disableCss, transitionClassesObj, timeoutMap, enter],
  );
  const afterEnterWrapper = React.useMemo(
    () =>
      createAfterEventHook(
        !disableCss && {
          enterDone: transitionClassesObj.enterDone,
        },
        afterEnter,
      ),
    [disableCss, afterEnter, transitionClassesObj],
  );
  const enterCancelledWrapper = React.useMemo(() => createEventCancelledHook(enterCancelled), [
    enterCancelled,
  ]);

  const beforeLeaveWrapper = React.useMemo(
    () =>
      createBeforeEventHook(
        !disableCss && {
          leave: transitionClassesObj.leave,
          leaveActive: transitionClassesObj.leaveActive,
        },
        beforeLeave,
      ),
    [disableCss, transitionClassesObj, beforeLeave],
  );

  const leaveWrapper = React.useMemo(
    () =>
      createEventHook(
        !disableCss && {
          leaveTo: transitionClassesObj.leaveTo,
          leaveActive: transitionClassesObj.leaveActive,
        },
        timeoutMap.leave,
        leave,
      ),
    [disableCss, transitionClassesObj, timeoutMap, leave],
  );
  const afterLeaveWrapper = React.useMemo(
    () =>
      createAfterEventHook(
        !disableCss && {
          leaveDone: transitionClassesObj.leaveDone,
        },
        afterLeave,
      ),
    [disableCss, afterLeave, transitionClassesObj],
  );
  const leaveCancelledWrapper = React.useMemo(() => createEventCancelledHook(leaveCancelled), [
    leaveCancelled,
  ]);

  const beforeDisappearWrapper = React.useMemo(
    () =>
      createBeforeEventHook(
        !disableCss && {
          disappear: transitionClassesObj.disappear,
          disappearActive: transitionClassesObj.disappearActive,
        },
        beforeDisappear,
      ),
    [disableCss, transitionClassesObj, beforeDisappear],
  );

  const disappearWrapper = React.useMemo(
    () =>
      createEventHook(
        !disableCss && {
          disappearTo: transitionClassesObj.disappearTo,
          disappearActive: transitionClassesObj.disappearActive,
        },
        timeoutMap.disappear,
        disappear,
      ),
    [disableCss, transitionClassesObj, timeoutMap, disappear],
  );
  const afterDisappearWrapper = React.useMemo(
    () =>
      createAfterEventHook(
        !disableCss && {
          disappearDone: transitionClassesObj.disappearDone,
        },
        afterDisappear,
      ),
    [disableCss, afterDisappear, transitionClassesObj],
  );
  const disappearCancelledWrapper = React.useMemo(
    () => createEventCancelledHook(disappearCancelled),
    [disappearCancelled],
  );

  return (
    <Transition
      {...others}
      beforeAppear={beforeAppearWrapper}
      appear={appearWrapper}
      afterAppear={afterAppearWrapper}
      appearCancelled={appearCancelledWrapper}
      beforeEnter={beforeEnterWrapper}
      enter={enterWrapper}
      afterEnter={afterEnterWrapper}
      enterCancelled={enterCancelledWrapper}
      beforeLeave={beforeLeaveWrapper}
      leave={leaveWrapper}
      afterLeave={afterLeaveWrapper}
      leaveCancelled={leaveCancelledWrapper}
      beforeDisappear={beforeDisappearWrapper}
      disappear={disappearWrapper}
      afterDisappear={afterDisappearWrapper}
      disappearCancelled={disappearCancelledWrapper}
    />
  );
};

CSSTransition.propTypes = {
  transitionClasses: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  timeout: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  disableCss: PropTypes.bool,
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
};

export default CSSTransition;

const createBeforeEventHook = (
  ctc: CSSTransitionClassesObject | false,
  nativeHook?: BeforeEventHook,
): BeforeEventHook => {
  return (el: TransitionElement) => {
    if (el._originalDisplay === undefined) {
      el._originalDisplay = el.style.display;
    }
    if (!el._cancelled) {
      el.style.display = 'none';
    }
    if (ctc) {
      updateClass(el, ctc);
    }
    nativeHook?.(el);

    el._cancelled = false;

    el.style.display = el._originalDisplay;
    el._originalDisplay = undefined;
  };
};

const createEventHook = (
  ctc: CSSTransitionClassesObject | false,
  timeout?: number,
  nativeHook?: EventHook,
): EventHook => {
  return (el: TransitionElement, done: () => void, isCancelled: () => boolean) => {
    let cancelEvent: () => void;
    let timeoutId: NodeJS.Timeout;

    const doneCb = () => {
      el._done = undefined;
      done();
    };

    const cancelNextFrame = nextFrame(() => {
      if (!isCancelled()) {
        if (ctc) {
          updateClass(el, ctc);
        }
        if (timeout && timeout > 0) {
          timeoutId = setTimeout(doneCb, timeout);
        } else {
          cancelEvent = onTransitionEnd(el, doneCb);
        }
      }
    });
    nativeHook?.(el, doneCb, isCancelled);

    el._done = (cancel) => {
      // 清除事件
      cancelNextFrame();
      cancelEvent?.();
      clearTimeout(timeoutId);

      if (!cancel) {
        doneCb();
      }
    };
  };
};

const createAfterEventHook = (
  ctc: CSSTransitionClassesObject | false,
  nativeHook?: AfterEventHook,
): AfterEventHook => {
  return (el: TransitionElement) => {
    if (ctc) {
      updateClass(el, ctc);
    }
    nativeHook?.(el);
  };
};

const createEventCancelledHook = (nativeHook?: EventCancelledHook): EventCancelledHook => {
  return (el: TransitionElement) => {
    // 清除所有事件
    el._done?.(true);
    updateClass(el, {});
    el._cancelled = true;
    nativeHook?.(el);
  };
};

const updateClass = (el: TransitionElement, ctc: CSSTransitionClassesObject) => {
  const oldCtc = el._ctc || {};
  Object.keys(oldCtc).forEach((key) => {
    const name = key as keyof CSSTransitionClassesObject;
    removeClass(el, oldCtc[name]!);
  });
  Object.keys(ctc).forEach((key) => {
    const name = key as keyof CSSTransitionClassesObject;
    addClass(el, ctc[name]!);
  });

  el._ctc = ctc;
};
