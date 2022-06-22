import PropTypes from 'prop-types';
import React from 'react';
import { addClass, getComputedStyle, isProduction, removeClass, warning } from '@xl-vision/utils';
import {
  CssTransitionOptions,
  TransitionCancelledHook,
  TransitionEndHook,
  TransitionStartHook,
  TransitionStartingHook,
  useConstantFn,
  useCssTransition,
  useForkRef,
} from '@xl-vision/hooks';
import { supportRef } from '../utils/ref';
import { forceReflow } from '../utils/dom';

export type CollapseTransitionProp = CssTransitionOptions & {
  children: React.ReactElement;
  horizontal?: true;
  unmountOnExit?: boolean;
};

const displayName = 'CollapseTransition';

const CollapseTransition: React.FC<CollapseTransitionProp> = (props) => {
  const {
    horizontal,
    onEnter,
    onEntering,
    onEntered,
    onEnterCancelled,
    onExit,
    onExiting,
    onExited,
    onExitCancelled,
    unmountOnExit,
    children,
    ...others
  } = props;

  const child = React.Children.only(children);

  warning(!supportRef(child), '<%s>: child does not support ref', displayName);

  const mappings = React.useMemo(() => {
    const padding1: keyof React.CSSProperties = horizontal ? 'paddingLeft' : 'paddingTop';
    const padding2: keyof React.CSSProperties = horizontal ? 'paddingRight' : 'paddingBottom';
    const size: keyof React.CSSProperties = horizontal ? 'width' : 'height';

    return {
      padding1,
      padding2,
      size,
    };
  }, [horizontal]);

  const actualSizeRef = React.useRef<string>();
  const padding1Ref = React.useRef<string>();
  const padding2Ref = React.useRef<string>();
  const sizeRef = React.useRef<string>();
  const overflowRef = React.useRef<string>();

  const isCancelledRef = React.useRef(false);

  const handleEnter: TransitionStartHook = useConstantFn((nativeEl, transitionOnFirst) => {
    const el = nativeEl as HTMLElement;

    const { padding1, padding2, size } = mappings;

    padding1Ref.current = el.style[padding1];
    padding2Ref.current = el.style[padding2];
    sizeRef.current = el.style[size];
    overflowRef.current = el.style.overflow;

    if (!isCancelledRef.current) {
      removeClass(el, transitionClassesRef.current.activeClass || '');
      removeClass(el, transitionClassesRef.current.fromClass || '');
      actualSizeRef.current = getComputedStyle(el)[size];
    }

    el.style.overflow = 'hidden';
    el.style[padding1] = '0';
    el.style[padding2] = '0';
    el.style[size] = '0';

    if (!isCancelledRef.current) {
      addClass(el, transitionClassesRef.current.fromClass || '');
      forceReflow();
      addClass(el, transitionClassesRef.current.activeClass || '');
    }

    isCancelledRef.current = false;
    onEnter?.(nativeEl, transitionOnFirst);
  });

  const handleEntering: TransitionStartingHook = useConstantFn(
    (nativeEl, done, transitionOnFirst, isCancelled) => {
      const el = nativeEl as HTMLElement;
      const { padding1, padding2, size } = mappings;

      el.style[size] = actualSizeRef.current!;
      el.style[padding1] = padding1Ref.current!;
      el.style[padding2] = padding2Ref.current!;

      onEntering?.(nativeEl, done, transitionOnFirst, isCancelled);
    },
  );

  const handleEntered: TransitionEndHook = useConstantFn((nativeEl, transitionOnFirst) => {
    const el = nativeEl as HTMLElement;
    const { size } = mappings;

    el.style[size] = sizeRef.current!;
    el.style.overflow = overflowRef.current!;

    onEntered?.(nativeEl, transitionOnFirst);
  });

  const handleEnterCancelled: TransitionCancelledHook = useConstantFn(
    (nativeEl, transitionOnFirst) => {
      const el = nativeEl as HTMLElement;
      const { padding1, padding2, size } = mappings;

      isCancelledRef.current = true;

      el.style[padding1] = padding1Ref.current!;
      el.style[padding2] = padding2Ref.current!;
      el.style[size] = sizeRef.current!;
      el.style.overflow = overflowRef.current!;

      onEnterCancelled?.(nativeEl, transitionOnFirst);
    },
  );

  const handleExit: TransitionStartHook = useConstantFn((nativeEl, transitionOnFirst) => {
    const el = nativeEl as HTMLElement;

    const { padding1, padding2, size } = mappings;

    padding1Ref.current = el.style[padding1];
    padding2Ref.current = el.style[padding2];
    sizeRef.current = el.style[size];
    overflowRef.current = el.style.overflow;

    if (!isCancelledRef.current) {
      actualSizeRef.current = getComputedStyle(el)[size];
    }
    el.style[size] = actualSizeRef.current!;
    el.style.overflow = 'hidden';

    isCancelledRef.current = false;

    onExit?.(nativeEl, transitionOnFirst);
  });

  const handleExiting: TransitionStartingHook = useConstantFn(
    (nativeEl, done, transitionOnFirst, isCancelled) => {
      const el = nativeEl as HTMLElement;

      const { padding1, padding2, size } = mappings;

      forceReflow();
      el.style[padding1] = '0';
      el.style[padding2] = '0';
      el.style[size] = '0';

      onExiting?.(nativeEl, done, transitionOnFirst, isCancelled);
    },
  );

  const handleExited: TransitionEndHook = useConstantFn((nativeEl, transitionOnFirst) => {
    const el = nativeEl as HTMLElement;

    const { padding1, padding2, size } = mappings;

    el.style[padding1] = padding1Ref.current!;
    el.style[padding2] = padding2Ref.current!;
    el.style[size] = sizeRef.current!;
    el.style.overflow = overflowRef.current!;

    onExited?.(nativeEl, transitionOnFirst);

    // setTransitionStyle({});
  });

  const handleExitCancelled: TransitionCancelledHook = useConstantFn(
    (nativeEl, transitionOnFirst) => {
      const el = nativeEl as HTMLElement;
      const { padding1, padding2, size } = mappings;

      isCancelledRef.current = true;
      el.style[padding1] = padding1Ref.current!;
      el.style[padding2] = padding2Ref.current!;
      el.style[size] = sizeRef.current!;
      el.style.overflow = overflowRef.current!;

      onExitCancelled?.(nativeEl, transitionOnFirst);
    },
  );

  const { nodeRef, show, transitionClassesRef } = useCssTransition({
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

  const forkRef = useForkRef(
    React.isValidElement<React.ReactInstance>(child)
      ? (child as { ref?: React.Ref<unknown> }).ref
      : null,
    nodeRef,
  );

  // 判断是否是第一次挂载
  const isFirstMountRef = React.useRef(true);

  if (show) {
    isFirstMountRef.current = false;
  } else {
    if (isFirstMountRef.current) {
      return null;
    }
    if (unmountOnExit) {
      return null;
    }
  }

  const style = { ...(child.props as { style?: {} }).style, display: show ? '' : 'none' };

  return React.cloneElement(child, {
    ref: forkRef,
    style,
  });
};

if (!isProduction) {
  CollapseTransition.displayName = displayName;

  CollapseTransition.propTypes = {
    horizontal: PropTypes.bool,
  };
}

if (!isProduction) {
  CollapseTransition.displayName = displayName;

  CollapseTransition.propTypes = {
    children: PropTypes.element,
    unmountOnExit: PropTypes.bool,
    onEnter: PropTypes.func,
    onEntering: PropTypes.func,
    onEntered: PropTypes.func,
    onEnterCancelled: PropTypes.func,
    onExit: PropTypes.func,
    onExiting: PropTypes.func,
    onExited: PropTypes.func,
    onExitCancelled: PropTypes.func,

    in: PropTypes.bool,
    transitionOnFirst: PropTypes.bool,
    disableCss: PropTypes.bool,
    timeout: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.exact({
        appear: PropTypes.number,
        enter: PropTypes.number,
        exit: PropTypes.number,
        disappear: PropTypes.number,
      }),
    ]),
    transitionClassName: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.exact({
        appearActive: PropTypes.string,
        appearFrom: PropTypes.string,
        appearTo: PropTypes.string,
        enterActive: PropTypes.string,
        enterFrom: PropTypes.string,
        enterTo: PropTypes.string,
        exitActive: PropTypes.string,
        exitFrom: PropTypes.string,
        exitTo: PropTypes.string,
        disappearActive: PropTypes.string,
        disappearFrom: PropTypes.string,
        disappearTo: PropTypes.string,
      }),
    ]),
  };
}

export default CollapseTransition;
