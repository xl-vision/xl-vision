import PropTypes from 'prop-types';
import React from 'react';
import { getComputedStyle, isProduction, nextFrame, onTransitionEnd } from '@xl-vision/utils';
import {
  TransitionCancelledHook,
  TransitionEndHook,
  TransitionStartHook,
  TransitionStartingHook,
  useConstantFn,
} from '@xl-vision/hooks';
import CssTransition, { CssTransitionProps } from '../CssTransition';

export interface CollapseTransitionProp
  extends Omit<CssTransitionProps, 'mountOnEnter' | 'unmountOnExit' | 'disableCss'> {
  children: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
  horizontal?: boolean;
}

const CollapseTransition: React.FunctionComponent<CollapseTransitionProp> = (props) => {
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
    children,
    ...others
  } = props;

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

  const handleEnter: TransitionStartHook = useConstantFn((nativeEl, transitionOnFirst) => {
    onEnter?.(nativeEl, transitionOnFirst);

    const el = nativeEl as HTMLElement;

    const { padding1, padding2, size } = mappings;

    padding1Ref.current = padding1Ref.current || el.style[padding1];
    padding2Ref.current = padding2Ref.current || el.style[padding2];
    sizeRef.current = sizeRef.current || el.style[size];
    overflowRef.current = overflowRef.current || el.style.overflow;
    actualSizeRef.current = actualSizeRef.current || getComputedStyle(nativeEl)[size];

    console.log(1, nativeEl.cloneNode(), actualSizeRef.current);

    el.style.overflow = 'hidden';
    el.style[padding1] = '0px';
    el.style[padding2] = '0px';
    el.style[size] = '0px';
    el.style.transitionDuration = '0s';

    // setTransitionStyle({
    //   overflow: 'hidden',
    //   [size]: 0,
    //   [padding1]: 0,
    //   [padding2]: 0,
    // });
    console.log(2, nativeEl.cloneNode(), actualSizeRef.current);
  });

  const handleEntering: TransitionStartingHook = useConstantFn(
    (nativeEl, done, transitionOnFirst, isCancelled) => {
      onEntering?.(nativeEl, done, transitionOnFirst, isCancelled);

      const el = nativeEl as HTMLElement;

      setTimeout(() => {
        
      })

      const { padding1, padding2, size } = mappings;
      console.log(3, nativeEl.cloneNode(), actualSizeRef.current);

      el.style[padding1] = padding1Ref.current!;
      el.style[padding2] = padding2Ref.current!;
      el.style[size] = actualSizeRef.current!;
      console.log(4, nativeEl.cloneNode(), actualSizeRef.current);

      // nextFrame(() => {
      //   if (isCancelled()) {
      //     return;
      //   }

      //   el.style[padding1] = padding1Ref.current!;
      //   el.style[padding2] = padding2Ref.current!;
      //   el.style[size] = actualSizeRef.current!;

      //   // setTransitionStyle({
      //   //   overflow: 'hidden',
      //   //   [size]: actualSizeRef.current,
      //   // });
      //   console.log(4, nativeEl.cloneNode(), actualSizeRef.current);
      //   // onTransitionEnd(el, done);
      // });
    },
  );

  const handleEntered: TransitionEndHook = useConstantFn((nativeEl, transitionOnFirst) => {
    onEntered?.(nativeEl, transitionOnFirst);
    const el = nativeEl as HTMLElement;

    // const el = nativeEl as HTMLElement;
    const { size, padding1, padding2, actualSize } = mappings;

    // el.style[size] = el.dataset[size]!;
    // el.style[padding1] = el.dataset[padding1]!;
    // el.style[padding2] = el.dataset[padding2]!;
    // el.style.overflow = el.dataset.overflow!;

    // delete el.dataset[padding1];
    // delete el.dataset[padding2];
    // delete el.dataset[size];
    // delete el.dataset.overflow;
    // delete el.dataset[actualSize];

    el.style[size] = sizeRef.current!;
    el.style.overflow = overflowRef.current!;

    actualSizeRef.current = undefined;
    padding1Ref.current = undefined;
    padding2Ref.current = undefined;
    sizeRef.current = undefined;
    overflowRef.current = undefined;
    console.log(5, nativeEl.cloneNode(), actualSizeRef.current);
  });

  const handleEnterCancelled: TransitionCancelledHook = useConstantFn(
    (nativeEl, transitionOnFirst) => {
      onEnterCancelled?.(nativeEl, transitionOnFirst);

      const el = nativeEl as HTMLElement;
      console.log('handleEnterCancelled');
    },
  );

  const handleExit: TransitionStartHook = useConstantFn((nativeEl, transitionOnFirst) => {
    onExit?.(nativeEl, transitionOnFirst);

    const { size } = mappings;

    actualSizeRef.current = actualSizeRef.current || getComputedStyle(nativeEl)[size];

    // setTransitionStyle({
    //   overflow: 'hidden',
    //   [size]: actualSizeRef.current,
    // });
  });

  const handleExiting: TransitionStartingHook = useConstantFn(
    (nativeEl, done, transitionOnFirst, isCancelled) => {
      onExiting?.(nativeEl, done, transitionOnFirst, isCancelled);

      const { padding1, padding2, size } = mappings;

      nextFrame(() => {
        if (isCancelled()) {
          return;
        }

        // setTransitionStyle({
        //   overflow: 'hidden',
        //   [padding1]: 0,
        //   [padding2]: 0,
        //   [size]: 0,
        // });
      });
    },
  );

  const handleExited: TransitionEndHook = useConstantFn((nativeEl, transitionOnFirst) => {
    onExited?.(nativeEl, transitionOnFirst);

    // setTransitionStyle({});
    actualSizeRef.current = undefined;
  });

  const handleExitCancelled: TransitionCancelledHook = useConstantFn(
    (nativeEl, transitionOnFirst) => {
      onExitCancelled?.(nativeEl, transitionOnFirst);

      const el = nativeEl as HTMLElement;
      console.log('handleExitCancelled');
    },
  );

  return (
    <CssTransition
      {...others}
      onEnter={handleEnter}
      onEntering={handleEntering}
      onEntered={handleEntered}
      onEnterCancelled={handleEnterCancelled}
      onExit={handleExit}
      onExiting={handleExiting}
      onExited={handleExited}
      onExitCancelled={handleExitCancelled}
      mountOnEnter={true}
    >
      {(show) => {
        const style = { ...(children.props as { style?: React.CSSProperties }).style };
        if (!show) {
          style.display = 'none';
        }
        return React.cloneElement(children, {
          style,
        });
      }}
    </CssTransition>
  );
};

if (!isProduction) {
  CollapseTransition.displayName = 'CollapseTransition';

  CollapseTransition.propTypes = {
    horizontal: PropTypes.bool,
  };
}

export default CollapseTransition;
