import { nextFrame } from '@xl-vision/utils';
import { useMemo, useRef, useState } from 'react';
import useConstantFn from '../useConstantFn';
import useIsomorphicLayoutEffect from '../useIsomorphicLayoutEffect';
import useTransition, {
  TransitionEndHook,
  TransitionOptions,
  TransitionStartHook,
  TransitionStartingHook,
} from '../useTransition';
import { onTransitionEnd } from './transitionUtils';

export type CssTransitionAction = 'appear' | 'enter' | 'exit' | 'disappear';

export type CssTransitionState = `${CssTransitionAction}${'' | 'ing' | 'ed'}`;

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

export type CssTransitionOptions = TransitionOptions & {
  timeout?: CssTransitionTimeout;
  transitionClasseName?: CssTransitionClassName;
};

const useCssTransition = (options: CssTransitionOptions) => {
  const {
    timeout,
    transitionClasseName,
    onEnter,
    onEntering,
    onEntered,
    onExit,
    onExiting,
    onExited,
    ...others
  } = options;

  const transitionClassNameRecord: CssTransitionClassNameRecord = useMemo(() => {
    if (!transitionClasseName) {
      return {};
    }
    if (typeof transitionClasseName === 'object') {
      return transitionClasseName;
    }
    const ret: Required<CssTransitionClassNameRecord> = {
      appearActive: `${transitionClasseName}-appear-active`,
      appear: `${transitionClasseName}-appear`,
      appearing: `${transitionClasseName}-appear-to`,
      enterActive: `${transitionClasseName}-enter-active`,
      enter: `${transitionClasseName}-enter`,
      entering: `${transitionClasseName}-enter-to`,
      disappearActive: `${transitionClasseName}-disappear-active`,
      disappear: `${transitionClasseName}-disappear`,
      disappearing: `${transitionClasseName}-disappear-to`,
      exitActive: `${transitionClasseName}-exit-active`,
      exit: `${transitionClasseName}-exit`,
      exiting: `${transitionClasseName}-exit-to`,
    };
    return ret;
  }, [transitionClasseName]);

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

  const handleEnter: TransitionStartHook = useConstantFn((el, transitionOnFirst) => {
    setState(transitionOnFirst ? 'appear' : 'enter');
    onEnter?.(el, transitionOnFirst);
  });

  const handleEntering: TransitionStartingHook = useConstantFn(
    (el, done, transitionOnFirst, isCancelled) => {
      const time = transitionOnFirst ? timeoutRecord.appear : timeoutRecord.enter;
      if (Number(time) >= 0) {
        setTimeout(done, time);
      }

      onEntering?.(el, done, transitionOnFirst, isCancelled);

      const cb = () => {
        doneRef.current = undefined;
        nextFrame(() => {
          if (isCancelled()) {
            return;
          }
          setState(transitionOnFirst ? 'appearing' : 'entering');
        });
        onTransitionEnd(el, done);
      };
      doneRef.current = cb;
    },
  );

  const handleEntered: TransitionEndHook = useConstantFn((el, transitionOnFirst) => {
    setState(transitionOnFirst ? 'appeared' : 'entered');
    onEntered?.(el, transitionOnFirst);
  });

  const handleExit: TransitionStartHook = useConstantFn((el, transitionOnFirst) => {
    setState(transitionOnFirst ? 'disappear' : 'exit');
    onExit?.(el, transitionOnFirst);
  });

  const handleExiting: TransitionStartingHook = useConstantFn(
    (el, done, transitionOnFirst, isCancelled) => {
      const time = transitionOnFirst ? timeoutRecord.disappear : timeoutRecord.exit;
      if (Number(time) >= 0) {
        setTimeout(done, time);
      }

      onExiting?.(el, done, transitionOnFirst, isCancelled);

      const cb = () => {
        doneRef.current = undefined;
        nextFrame(() => {
          if (isCancelled()) {
            return;
          }
          setState(transitionOnFirst ? 'disappearing' : 'exiting');
        });
        onTransitionEnd(el, done);
      };

      doneRef.current = cb;
    },
  );

  const handleExited: TransitionEndHook = useConstantFn((el, transitionOnFirst) => {
    setState(transitionOnFirst ? 'disappeared' : 'exited');
    onExited?.(el, transitionOnFirst);
  });

  const { nodeRef, transitionOnFirst } = useTransition({
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

  if (state) {
    const action = state.replace(/ing|ed$/, '') as CssTransitionAction;
    if (state.match(/ed$/)) {
      classes.push(transitionClassNameRecord[`${action}ing`]);
    } else if (state.match(/ing$/)) {
      classes.push(transitionClassNameRecord[`${action}Active`]);
      classes.push(transitionClassNameRecord[`${action}ing`]);
    } else {
      classes.push(transitionClassNameRecord[`${action}Active`]);
      classes.push(transitionClassNameRecord[action]);
    }
  }

  return {
    nodeRef,
    transitionOnFirst,
    state,
    activeClassName: classes.filter(Boolean).join(' '),
  };
};

export default useCssTransition;
