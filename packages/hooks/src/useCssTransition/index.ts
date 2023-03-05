import { addClass, isObject, nextFrame, onTransitionEnd, removeClass } from '@xl-vision/utils';
import { useMemo, useRef } from 'react';
import useConstantFn from '../useConstantFn';
import useTransition, {
  TransitionCancelledHook,
  TransitionEndHook,
  TransitionOptions,
  TransitionStartHook,
  TransitionStartingHook,
} from '../useTransition';

export type CssTransitionAction = 'appear' | 'enter' | 'exit' | 'disappear';

export type CssTransitionClassNameRecord = Partial<
  Record<`${CssTransitionAction}${'Active' | 'From' | 'To'}`, string>
>;

export type CssTransitionClassName = CssTransitionClassNameRecord | string;

export type CssTransitionTimeoutRecord = Partial<Record<CssTransitionAction, number>>;

export type CssTransitionTimeout = CssTransitionTimeoutRecord | number;

export type CssTransitionOptions<T extends Element = Element> = TransitionOptions<T> & {
  timeout?: CssTransitionTimeout;
  disableCss?: boolean;
  transitionClassName?: CssTransitionClassName;
};

const useCssTransition = <T extends Element = Element>(options: CssTransitionOptions<T>) => {
  const {
    timeout,
    transitionClassName,
    disableCss,
    onEnter,
    onEntering,
    onEntered,
    onEnterCancelled,
    onExit,
    onExiting,
    onExited,
    onExitCancelled,
    ...others
  } = options;

  const transitionClassNameRecord: CssTransitionClassNameRecord = useMemo(() => {
    if (!transitionClassName) {
      return {};
    }
    if (isObject(transitionClassName)) {
      return transitionClassName;
    }
    const ret: Required<CssTransitionClassNameRecord> = {
      appearActive: `${transitionClassName}-appear-active`,
      appearFrom: `${transitionClassName}-appear-from`,
      appearTo: `${transitionClassName}-appear-to`,
      enterActive: `${transitionClassName}-enter-active`,
      enterFrom: `${transitionClassName}-enter-from`,
      enterTo: `${transitionClassName}-enter-to`,
      disappearActive: `${transitionClassName}-disappear-active`,
      disappearFrom: `${transitionClassName}-disappear-from`,
      disappearTo: `${transitionClassName}-disappear-to`,
      exitActive: `${transitionClassName}-exit-active`,
      exitFrom: `${transitionClassName}-exit-from`,
      exitTo: `${transitionClassName}-exit-to`,
    };
    return ret;
  }, [transitionClassName]);

  const timeoutRecord: CssTransitionTimeoutRecord = useMemo(() => {
    if (timeout === undefined || typeof timeout === 'number') {
      const ret: CssTransitionTimeoutRecord = {
        appear: timeout,
        enter: timeout,
        exit: timeout,
        disappear: timeout,
      };

      return ret;
    }

    return timeout;
  }, [timeout]);

  const transitionClassesRef = useRef<{
    activeClass?: string;
    fromClass?: string;
    toClass?: string;
  }>({});

  const handleEnter: TransitionStartHook<T> = useConstantFn((el, transitionOnFirst) => {
    const fromClass = transitionClassNameRecord[transitionOnFirst ? 'appearFrom' : 'enterFrom'];
    const activeClass =
      transitionClassNameRecord[transitionOnFirst ? 'appearActive' : 'enterActive'];

    addClass(el, fromClass || '');
    transitionClassesRef.current.fromClass = fromClass;
    addClass(el, activeClass || '');
    transitionClassesRef.current.activeClass = activeClass;

    onEnter?.(el, transitionOnFirst);
  });

  const handleEntering: TransitionStartingHook<T> = useConstantFn(
    (el, done, transitionOnFirst, isCancelled) => {
      const time = transitionOnFirst ? timeoutRecord.appear : timeoutRecord.enter;

      const toClass = transitionClassNameRecord[transitionOnFirst ? 'appearTo' : 'enterTo'];

      nextFrame(() => {
        if (isCancelled()) {
          return;
        }
        const { fromClass } = transitionClassesRef.current;
        removeClass(el, fromClass || '');
        delete transitionClassesRef.current.fromClass;

        addClass(el, toClass || '');
        transitionClassesRef.current.toClass = toClass;

        if (!disableCss) {
          if (Number(time) >= 0) {
            setTimeout(done, time);
          } else {
            onTransitionEnd(el, done);
          }
        }
      });
      onEntering?.(el, done, transitionOnFirst, isCancelled);
    },
  );

  const handleEntered: TransitionEndHook<T> = useConstantFn((el, transitionOnFirst) => {
    const { toClass, activeClass, fromClass } = transitionClassesRef.current;

    removeClass(el, activeClass || '');
    delete transitionClassesRef.current.activeClass;
    removeClass(el, toClass || '');
    delete transitionClassesRef.current.toClass;
    removeClass(el, fromClass || '');
    delete transitionClassesRef.current.fromClass;

    onEntered?.(el, transitionOnFirst);
  });

  const handleEnterCancelled: TransitionCancelledHook<T> = useConstantFn(
    (el, transitionOnFirst) => {
      const { fromClass, activeClass, toClass } = transitionClassesRef.current;

      removeClass(el, fromClass || '');
      delete transitionClassesRef.current.fromClass;
      removeClass(el, activeClass || '');
      delete transitionClassesRef.current.activeClass;
      removeClass(el, toClass || '');
      delete transitionClassesRef.current.toClass;

      onEnterCancelled?.(el, transitionOnFirst);
    },
  );

  const handleExit: TransitionStartHook<T> = useConstantFn((el, transitionOnFirst) => {
    const fromClass = transitionClassNameRecord[transitionOnFirst ? 'disappearFrom' : 'exitFrom'];
    const activeClass =
      transitionClassNameRecord[transitionOnFirst ? 'disappearActive' : 'exitActive'];

    addClass(el, fromClass || '');
    transitionClassesRef.current.fromClass = fromClass;
    addClass(el, activeClass || '');
    transitionClassesRef.current.activeClass = activeClass;

    onExit?.(el, transitionOnFirst);
  });

  const handleExiting: TransitionStartingHook<T> = useConstantFn(
    (el, done, transitionOnFirst, isCancelled) => {
      const time = transitionOnFirst ? timeoutRecord.appear : timeoutRecord.enter;

      const toClass = transitionClassNameRecord[transitionOnFirst ? 'disappearTo' : 'exitTo'];

      nextFrame(() => {
        if (isCancelled()) {
          return;
        }
        const { fromClass } = transitionClassesRef.current;
        removeClass(el, fromClass || '');
        delete transitionClassesRef.current.fromClass;

        addClass(el, toClass || '');
        transitionClassesRef.current.toClass = toClass;

        if (!disableCss) {
          if (Number(time) >= 0) {
            setTimeout(done, time);
          } else {
            onTransitionEnd(el, done);
          }
        }
      });

      onExiting?.(el, done, transitionOnFirst, isCancelled);
    },
  );

  const handleExited: TransitionEndHook<T> = useConstantFn((el, transitionOnFirst) => {
    const { toClass, activeClass } = transitionClassesRef.current;

    removeClass(el, toClass || '');
    delete transitionClassesRef.current.toClass;
    removeClass(el, activeClass || '');
    delete transitionClassesRef.current.activeClass;

    onExited?.(el, transitionOnFirst);
  });

  const handleExitCancelled: TransitionCancelledHook<T> = useConstantFn((el, transitionOnFirst) => {
    const { fromClass, activeClass, toClass } = transitionClassesRef.current;

    removeClass(el, fromClass || '');
    delete transitionClassesRef.current.fromClass;
    removeClass(el, activeClass || '');
    delete transitionClassesRef.current.activeClass;
    removeClass(el, toClass || '');
    delete transitionClassesRef.current.toClass;

    onExitCancelled?.(el, transitionOnFirst);
  });

  const data = useTransition<T>({
    ...others,
    onEnter: handleEnter,
    onEntering: handleEntering,
    onEntered: handleEntered,
    onEnterCancelled: handleEnterCancelled,
    onExit: handleExit,
    onExiting: handleExiting,
    onExited: handleExited,
    onExitCancelled: handleExitCancelled,
  });

  return {
    ...data,
    transitionClassesRef,
  };
};

export default useCssTransition;
