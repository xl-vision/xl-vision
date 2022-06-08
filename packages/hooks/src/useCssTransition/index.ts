import { useMemo } from 'react';
import useConstantFn from '../useConstantFn';
import useTransition, { TransitionOptions, TransitionStartingHook } from '../useTransition';
import { onTransitionEnd } from './transitionUtils';

export type CssTransitionClassNameObject = Partial<{
  appearActive: string;
  appear: string;
  appeared: string;

  enterActive: string;
  enter: string;
  entered: string;

  leaveActive: string;
  leave: string;
  leaved: string;

  disappearActive: string;
  disappear: string;
  disappeared: string;
}>;

export type CssTransitionClassNames = CssTransitionClassNameObject | string;

export type CssTransitionOptions = TransitionOptions & {
  timeout?:
    | number
    | {
        appear?: number;
        enter?: number;
        leave?: number;
        disappear?: number;
      };
  transitionClasseNames?: CssTransitionClassNames;
};

const useCssTransition = (options: CssTransitionOptions) => {
  const { timeout, transitionClasseNames, onEntering, onLeaving, ...others } = options;

  const transitionClassesObject: CssTransitionClassNameObject = useMemo(() => {
    if (!transitionClasseNames) {
      return {};
    }
    if (typeof transitionClasseNames === 'object') {
      return transitionClasseNames;
    }
    return {
      appearActive: `${transitionClasseNames}-appear-active`,
      appear: `${transitionClasseNames}-appear-from`,
      appearing: `${transitionClasseNames}-appear-to`,
      appeared: `${transitionClasseNames}-appear-done`,
      enterActive: `${transitionClasseNames}-enter-active`,
      enter: `${transitionClasseNames}-enter-from`,
      entering: `${transitionClasseNames}-enter-to`,
      entered: `${transitionClasseNames}-enter-done`,
      disappearActive: `${transitionClasseNames}-disappear-active`,
      disappear: `${transitionClasseNames}-disappear-from`,
      disappearing: `${transitionClasseNames}-disappear-to`,
      disappeared: `${transitionClasseNames}-disappear-done`,
      leaveActive: `${transitionClasseNames}-leave-active`,
      leave: `${transitionClasseNames}-leave-from`,
      leaving: `${transitionClasseNames}-leave-to`,
      leaved: `${transitionClasseNames}-leave-done`,
    };
  }, [transitionClasseNames]);

  const handleEntering: TransitionStartingHook = useConstantFn(
    (el, done, transitionOnFirst, isCancelled) => {
      onTransitionEnd(el, done);
      onEntering?.(el, done, transitionOnFirst, isCancelled);
    },
  );

  const handleLeaving: TransitionStartingHook = useConstantFn(
    (el, done, transitionOnFirst, isCancelled) => {
      onTransitionEnd(el, done);
      onLeaving?.(el, done, transitionOnFirst, isCancelled);
    },
  );

  const { nodeRef, transitionOnFirst } = useTransition({
    ...others,
    onEntering: handleEntering,
    onLeaving: handleLeaving,
  });

  const classes: Array<string> = [];

  return {
    nodeRef,
    transitionOnFirst,
    activeClassName: classes.join(' '),
  };
};

export default useCssTransition;
