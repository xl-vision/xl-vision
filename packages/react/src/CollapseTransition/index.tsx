import PropTypes from 'prop-types';
import React from 'react';
import CSSTransition, { CSSTransitionClasses, TransitionElement } from '../CSSTransition';
import { forceReflow } from '../utils/transition';
import { removeClass, addClass } from '../utils/class';
import { isDevelopment } from '../utils/env';

export interface CollapseTransitionProp {
  children: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
  unmountOnLeave?: boolean;
  in: boolean;
  transitionClasses?: CSSTransitionClasses;
  horizontal?: boolean;
  transitionOnFirst?: boolean;
}

const CollapseTransition: React.FunctionComponent<CollapseTransitionProp> = (props) => {
  const {
    children,
    transitionClasses,
    in: inProp,
    unmountOnLeave,
    horizontal,
    transitionOnFirst,
  } = props;

  const transitionEvents = React.useMemo(() => {
    const padding1 = horizontal ? 'paddingLeft' : 'paddingTop';
    const padding2 = horizontal ? 'paddingRight' : 'paddingBottom';
    const size = horizontal ? 'width' : 'height';
    const actualSize = horizontal ? 'actualWidth' : 'actualHeight';

    return {
      beforeEnter(el: TransitionElement) {
        el.dataset[padding1] = el.style[padding1];
        el.dataset[padding2] = el.style[padding2];
        el.dataset[size] = el.style[size];
        el.dataset.overflow = el.style.overflow;

        const { display } = el.dataset;

        if (display !== undefined) {
          el.style.display = display;
          el.dataset.display = undefined;
        }

        if (!el._cancelled) {
          removeClass(el, el._ctc?.enter || '');
          removeClass(el, el._ctc?.enterActive || '');
          el.dataset[actualSize] = getComputedStyle(el)[size];
        }
        el.style.overflow = 'hidden';
        el.style[size] = '0';
        el.style[padding1] = '0';
        el.style[padding2] = '0';

        if (!el._cancelled) {
          addClass(el, el._ctc?.enter || '');
          forceReflow();
          addClass(el, el._ctc?.enterActive || '');
        }
      },
      enter(el: HTMLElement) {
        el.style[size] = `${el.dataset[actualSize]!}`;
        el.style[padding1] = el.dataset[padding1]!;
        el.style[padding2] = el.dataset[padding2]!;
      },
      afterEnter(el: HTMLElement) {
        el.style[size] = el.dataset[size]!;
        el.style.overflow = el.dataset.overflow!;
      },
      enterCancelled(el: HTMLElement) {
        el.style[padding1] = el.dataset[padding1]!;
        el.style[padding2] = el.dataset[padding2]!;
        el.style[size] = el.dataset[size]!;
        el.style.overflow = el.dataset.overflow!;
      },
      beforeLeave(el: TransitionElement) {
        el.dataset[padding1] = el.style[padding1];
        el.dataset[padding2] = el.style[padding2];
        el.dataset[size] = el.style[size];
        el.dataset.overflow = el.style.overflow;

        if (!el._cancelled) {
          el.dataset[actualSize] = getComputedStyle(el)[size];
        }

        el.style[size] = `${el.dataset[actualSize]!}`;
        el.style.overflow = 'hidden';
      },
      leave(el: HTMLElement) {
        forceReflow();
        el.style[padding1] = '0';
        el.style[padding2] = '0';
        el.style[size] = '0';
      },
      afterLeave(el: HTMLElement) {
        el.style[padding1] = el.dataset[padding1]!;
        el.style[padding2] = el.dataset[padding2]!;
        el.style[size] = el.dataset[size]!;
        el.style.overflow = el.dataset.overflow!;
        el.dataset.display = el.style.display || '';
        el.style.display = 'none';
      },
      leaveCancelled(el: HTMLElement) {
        el.style[padding1] = el.dataset[padding1]!;
        el.style[padding2] = el.dataset[padding2]!;
        el.style[size] = el.dataset[size]!;
        el.style.overflow = el.dataset.overflow!;
      },
    };
  }, [horizontal]);

  return (
    <CSSTransition
      {...transitionEvents}
      transitionClasses={transitionClasses}
      transitionOnFirst={transitionOnFirst}
      in={inProp}
      mountOnEnter={true}
      unmountOnLeave={unmountOnLeave}
    >
      {children}
    </CSSTransition>
  );
};

if (isDevelopment) {
  CollapseTransition.displayName = 'CollapseTransition';

  CollapseTransition.propTypes = {
    transitionClasses: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    horizontal: PropTypes.bool,
    children: PropTypes.element.isRequired,
    in: PropTypes.bool.isRequired,
    unmountOnLeave: PropTypes.bool,
    transitionOnFirst: PropTypes.bool,
  };
}

export default CollapseTransition;
