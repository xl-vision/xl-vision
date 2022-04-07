import PropTypes from 'prop-types';
import React from 'react';
import { isProduction } from '@xl-vision/utils';
import { useConstantFn } from '@xl-vision/hooks';
import CssTransition, { CssTransitionProps, CssTransitionElement } from '../CssTransition';
import { forceReflow } from '../utils/dom';
import { removeClass, addClass } from '../utils/class';
import { AfterEventHook, BeforeEventHook, EventCancelledHook, EventHook } from '../Transition';

export interface CollapseTransitionProp extends Omit<CssTransitionProps, 'mountOnEnter'> {
  children: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
  horizontal?: boolean;
}

export interface CollapseTransitionElement extends CssTransitionElement {
  _cancelled__?: boolean;
}

const CollapseTransition: React.FunctionComponent<CollapseTransitionProp> = (props) => {
  const {
    horizontal,
    beforeEnter,
    enter,
    enterCancelled,
    afterEnter,
    beforeLeave,
    leave,
    leaveCancelled,
    afterLeave,

    ...others
  } = props;

  const mappings = React.useMemo(() => {
    const padding1: keyof React.CSSProperties = horizontal ? 'paddingLeft' : 'paddingTop';
    const padding2: keyof React.CSSProperties = horizontal ? 'paddingRight' : 'paddingBottom';
    const size: keyof React.CSSProperties = horizontal ? 'width' : 'height';
    const actualSize = horizontal ? 'actualWidth' : 'actualHeight';

    return {
      padding1,
      padding2,
      size,
      actualSize,
    };
  }, [horizontal]);

  const beforeEnterWrapper: BeforeEventHook = useConstantFn(
    (el: CollapseTransitionElement, transitionOnFirst) => {
      const { padding1, padding2, size, actualSize } = mappings;

      const className1 = transitionOnFirst ? 'appearFrom' : 'enterFrom';
      const className2 = transitionOnFirst ? 'appearActive' : 'enterActive';

      el.dataset[padding1] = el.style[padding1];
      el.dataset[padding2] = el.style[padding2];
      el.dataset[size] = el.style[size];
      el.dataset.overflow = el.style.overflow;

      const { display } = el.dataset;

      if (display !== undefined) {
        el.style.display = display;
        el.dataset.display = undefined;
      }

      if (!el._cancelled__) {
        removeClass(el, el._ctc?.[className1] || '');
        removeClass(el, el._ctc?.[className2] || '');
        el.dataset[actualSize] = getComputedStyle(el)[size];
      }
      el.style.overflow = 'hidden';
      el.style[size] = '0';
      el.style[padding1] = '0';
      el.style[padding2] = '0';

      if (!el._cancelled__) {
        addClass(el, el._ctc?.[className1] || '');
        forceReflow();
        addClass(el, el._ctc?.[className2] || '');
      }

      el._cancelled__ = false;

      beforeEnter?.(el, transitionOnFirst);
    },
  );

  const enterWrapper: EventHook = useConstantFn(
    (
      el: CollapseTransitionElement,
      done: () => void,
      isCancelled: () => boolean,
      transitionOnFirst,
    ) => {
      const { padding1, padding2, size, actualSize } = mappings;

      el.style[size] = `${el.dataset[actualSize]!}`;
      el.style[padding1] = el.dataset[padding1]!;
      el.style[padding2] = el.dataset[padding2]!;

      enter?.(el, done, isCancelled, transitionOnFirst);
    },
  );

  const afterEnterWrapper: AfterEventHook = useConstantFn(
    (el: CollapseTransitionElement, transitionOnFirst) => {
      const { size } = mappings;

      el.style[size] = el.dataset[size]!;
      el.style.overflow = el.dataset.overflow!;

      afterEnter?.(el, transitionOnFirst);
    },
  );

  const enterCancelledWrapper: EventCancelledHook = useConstantFn(
    (el: CollapseTransitionElement, transitionOnFirst) => {
      const { padding1, padding2, size } = mappings;
      el._cancelled__ = true;
      el.style[padding1] = el.dataset[padding1]!;
      el.style[padding2] = el.dataset[padding2]!;
      el.style[size] = el.dataset[size]!;
      el.style.overflow = el.dataset.overflow!;
      enterCancelled?.(el, transitionOnFirst);
    },
  );

  const beforeLeaveWrapper: BeforeEventHook = useConstantFn(
    (el: CollapseTransitionElement, transitionOnFirst) => {
      const { padding1, padding2, size, actualSize } = mappings;

      el.dataset[padding1] = el.style[padding1];
      el.dataset[padding2] = el.style[padding2];
      el.dataset[size] = el.style[size];
      el.dataset.overflow = el.style.overflow;

      if (!el._cancelled__) {
        el.dataset[actualSize] = getComputedStyle(el)[size];
      }
      el.style[size] = `${el.dataset[actualSize]!}`;
      el.style.overflow = 'hidden';

      el._cancelled__ = false;
      beforeLeave?.(el, transitionOnFirst);
    },
  );

  const leaveWrapper: EventHook = useConstantFn(
    (
      el: CollapseTransitionElement,
      done: () => void,
      isCancelled: () => boolean,
      transitionOnFirst,
    ) => {
      const { padding1, padding2, size } = mappings;

      forceReflow();
      el.style[padding1] = '0';
      el.style[padding2] = '0';
      el.style[size] = '0';
      leave?.(el, done, isCancelled, transitionOnFirst);
    },
  );

  const afterLeaveWrapper: AfterEventHook = useConstantFn(
    (el: CollapseTransitionElement, transitionOnFirst) => {
      const { padding1, padding2, size } = mappings;

      el.style[padding1] = el.dataset[padding1]!;
      el.style[padding2] = el.dataset[padding2]!;
      el.style[size] = el.dataset[size]!;
      el.style.overflow = el.dataset.overflow!;
      el.dataset.display = el.style.display || '';
      el.style.display = 'none';
      afterLeave?.(el, transitionOnFirst);
    },
  );

  const leaveCancelledWrapper: EventCancelledHook = useConstantFn(
    (el: CollapseTransitionElement, transitionOnFirst) => {
      const { padding1, padding2, size } = mappings;

      el._cancelled__ = true;
      el.style[padding1] = el.dataset[padding1]!;
      el.style[padding2] = el.dataset[padding2]!;
      el.style[size] = el.dataset[size]!;
      el.style.overflow = el.dataset.overflow!;
      leaveCancelled?.(el, transitionOnFirst);
    },
  );

  return (
    <CssTransition
      {...others}
      beforeEnter={beforeEnterWrapper}
      enter={enterWrapper}
      afterEnter={afterEnterWrapper}
      enterCancelled={enterCancelledWrapper}
      beforeLeave={beforeLeaveWrapper}
      leave={leaveWrapper}
      afterLeave={afterLeaveWrapper}
      leaveCancelled={leaveCancelledWrapper}
      mountOnEnter={true}
    />
  );
};

if (!isProduction) {
  CollapseTransition.displayName = 'CollapseTransition';

  CollapseTransition.propTypes = {
    horizontal: PropTypes.bool,
    beforeEnter: PropTypes.func,
    enter: PropTypes.func,
    enterCancelled: PropTypes.func,
    afterEnter: PropTypes.func,
    beforeLeave: PropTypes.func,
    leave: PropTypes.func,
    leaveCancelled: PropTypes.func,
    afterLeave: PropTypes.func,
  };
}

export default CollapseTransition;
