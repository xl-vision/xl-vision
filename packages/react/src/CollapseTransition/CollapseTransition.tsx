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
import { addClass, getComputedStyle, isProduction, removeClass, warning } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { ReactElement, FC, Children, useMemo, CSSProperties, useRef, cloneElement } from 'react';
import { forceReflow } from '../utils/dom';
import { getNodeRef, supportRef } from '../utils/ref';

export type CollapseTransitionProp = CssTransitionOptions & {
  children: ReactElement<unknown>;
  horizontal?: boolean;
  unmountOnExit?: boolean;
};

const displayName = 'CollapseTransition';

const CollapseTransition: FC<CollapseTransitionProp> = (props) => {
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

  const child = Children.only(children);

  warning(!supportRef(child), '<%s>: child does not support ref', displayName);

  const mappings = useMemo(() => {
    const padding1: keyof CSSProperties = horizontal ? 'paddingLeft' : 'paddingTop';
    const padding2: keyof CSSProperties = horizontal ? 'paddingRight' : 'paddingBottom';
    const size: keyof CSSProperties = horizontal ? 'width' : 'height';

    return {
      padding1,
      padding2,
      size,
    };
  }, [horizontal]);

  const actualSizeRef = useRef<string>(null);
  const padding1Ref = useRef<string>(null);
  const padding2Ref = useRef<string>(null);
  const sizeRef = useRef<string>(null);
  const overflowRef = useRef<string>(null);

  const isCancelledRef = useRef(false);

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

  const forkRef = useForkRef(getNodeRef(child), nodeRef);

  // 判断是否是第一次挂载
  const isFirstMountRef = useRef(true);

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

  const style = { ...(child.props as { style?: object }).style, display: show ? '' : 'none' };

  return cloneElement(child as ReactElement<{ ref?: typeof forkRef; style?: object }>, {
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
    children: PropTypes.element.isRequired,
    in: PropTypes.bool.isRequired,
    disableCss: PropTypes.bool,
    timeout: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.exact({
        appear: PropTypes.number.isRequired,
        enter: PropTypes.number.isRequired,
        exit: PropTypes.number.isRequired,
        disappear: PropTypes.number.isRequired,
      }),
    ]),
    transitionClassName: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.exact({
        appearActive: PropTypes.string.isRequired,
        appearFrom: PropTypes.string.isRequired,
        appearTo: PropTypes.string.isRequired,
        enterActive: PropTypes.string.isRequired,
        enterFrom: PropTypes.string.isRequired,
        enterTo: PropTypes.string.isRequired,
        exitActive: PropTypes.string.isRequired,
        exitFrom: PropTypes.string.isRequired,
        exitTo: PropTypes.string.isRequired,
        disappearActive: PropTypes.string.isRequired,
        disappearFrom: PropTypes.string.isRequired,
        disappearTo: PropTypes.string.isRequired,
      }),
    ]),
    transitionOnFirst: PropTypes.bool,
    unmountOnExit: PropTypes.bool,
    onEnter: PropTypes.func,
    onEnterCancelled: PropTypes.func,
    onEntered: PropTypes.func,
    onEntering: PropTypes.func,
    onExit: PropTypes.func,
    onExitCancelled: PropTypes.func,
    onExited: PropTypes.func,
    onExiting: PropTypes.func,
  };
}

export default CollapseTransition;
