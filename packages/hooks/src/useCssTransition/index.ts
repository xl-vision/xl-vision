import { nextFrame, onTransitionEnd } from '@xl-vision/utils';
import { useMemo, useRef, useState } from 'react';
import useConstantFn from '../useConstantFn';
import useIsomorphicLayoutEffect from '../useIsomorphicLayoutEffect';
import useTransition, {
  TransitionEndHook,
  TransitionOptions,
  TransitionStartHook,
  TransitionStartingHook,
} from '../useTransition';

export type CssTransitionAction = 'appear' | 'enter' | 'exit' | 'disappear';

export type CssTransitionState = `${CssTransitionAction}${'' | 'ing'}`;

export type CssTransitionClassNameRecord = Partial<
  Record<`${CssTransitionAction}${'' | 'Active' | 'ing'}`, string>
>;

export type CssTransitionClassName = CssTransitionClassNameRecord | string;

export type CssTransitionTimeoutRecord = Partial<{
  appear: number;
  enter: number;
  exit: number;
  disappear: number;
}>;

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
    onExit,
    onExiting,
    onExited,
    ...others
  } = options;

  const transitionClassNameRecord: CssTransitionClassNameRecord = useMemo(() => {
    if (!transitionClassName) {
      return {};
    }
    if (typeof transitionClassName === 'object') {
      return transitionClassName;
    }
    const ret: Required<CssTransitionClassNameRecord> = {
      appearActive: `${transitionClassName}-appear-active`,
      appear: `${transitionClassName}-appear`,
      appearing: `${transitionClassName}-appear-to`,
      enterActive: `${transitionClassName}-enter-active`,
      enter: `${transitionClassName}-enter`,
      entering: `${transitionClassName}-enter-to`,
      disappearActive: `${transitionClassName}-disappear-active`,
      disappear: `${transitionClassName}-disappear`,
      disappearing: `${transitionClassName}-disappear-to`,
      exitActive: `${transitionClassName}-exit-active`,
      exit: `${transitionClassName}-exit`,
      exiting: `${transitionClassName}-exit-to`,
    };
    return ret;
  }, [transitionClassName]);

  const timeoutRecord: CssTransitionTimeoutRecord = useMemo(() => {
    if (typeof timeout === 'number' || typeof timeout === 'undefined') {
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

  const [state, setState] = useState<CssTransitionState>();

  const doneRef = useRef<() => void>();

  const handleEnter: TransitionStartHook<T> = useConstantFn((el, transitionOnFirst) => {
    setState(transitionOnFirst ? 'appear' : 'enter');
    onEnter?.(el, transitionOnFirst);
  });

  const handleEntering: TransitionStartingHook<T> = useConstantFn(
    (el, done, transitionOnFirst, isCancelled) => {
      const time = transitionOnFirst ? timeoutRecord.appear : timeoutRecord.enter;
      const useTime = Number(time) >= 0;
      if (useTime) {
        setTimeout(done, time);
      }

      const cb = () => {
        doneRef.current = undefined;
        if (isCancelled()) {
          return;
        }
        nextFrame(() => {
          if (isCancelled()) {
            return;
          }
          setState(transitionOnFirst ? 'appearing' : 'entering');
          if (!disableCss && !useTime) {
            console.log('onTransitionEnd start', el.cloneNode());
            const start = performance.now();
            onTransitionEnd(el, () => {
              done();
              console.log('spend', performance.now() - start);
            });
          }
        });
        onEntering?.(el, done, transitionOnFirst, isCancelled);
      };
      doneRef.current = cb;
    },
  );

  const handleEntered: TransitionEndHook<T> = useConstantFn((el, transitionOnFirst) => {
    setState(undefined);
    onEntered?.(el, transitionOnFirst);
  });

  const handleExit: TransitionStartHook<T> = useConstantFn((el, transitionOnFirst) => {
    setState(transitionOnFirst ? 'disappear' : 'exit');
    onExit?.(el, transitionOnFirst);
  });

  const handleExiting: TransitionStartingHook<T> = useConstantFn(
    (el, done, transitionOnFirst, isCancelled) => {
      const time = transitionOnFirst ? timeoutRecord.disappear : timeoutRecord.exit;
      const useTime = Number(time) >= 0;
      if (useTime) {
        setTimeout(done, time);
      }

      const cb = () => {
        doneRef.current = undefined;
        if (isCancelled()) {
          return;
        }

        nextFrame(() => {
          if (isCancelled()) {
            return;
          }
          setState(transitionOnFirst ? 'disappearing' : 'exiting');
          if (!disableCss && !useTime) {
            onTransitionEnd(el, done);
          }
        });
        onExiting?.(el, done, transitionOnFirst, isCancelled);
      };

      doneRef.current = cb;
    },
  );

  const handleExited: TransitionEndHook<T> = useConstantFn((el, transitionOnFirst) => {
    setState(undefined);
    onExited?.(el, transitionOnFirst);
  });

  const data = useTransition<T>({
    ...others,
    onEnter: handleEnter,
    onEntering: handleEntering,
    onEntered: handleEntered,
    onExit: handleExit,
    onExiting: handleExiting,
    onExited: handleExited,
  });

  useIsomorphicLayoutEffect(() => {
    doneRef.current?.();
  }, [state]);

  const classes: Array<string | undefined> = [];

  if (!disableCss && state) {
    const action = state.replace(/ing$/, '') as CssTransitionAction;
    classes.push(transitionClassNameRecord[`${action}Active`]);
    classes.push(transitionClassNameRecord[state]);
  }

  return {
    ...data,
    state,
    activeClassName: classes.filter(Boolean).join(' '),
  };
};

export default useCssTransition;
