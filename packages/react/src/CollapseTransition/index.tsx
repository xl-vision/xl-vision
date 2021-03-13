import PropTypes from 'prop-types';
import React from 'react';
import CSSTransition, { CSSTransitionProps, CSSTransitionElement } from '../CSSTransition';
import { forceReflow } from '../utils/transition';
import { removeClass, addClass } from '../utils/class';
import { isDevelopment } from '../utils/env';
import useEventCallback from '../hooks/useEventCallback';

export interface CollapseTransitionProp extends Omit<CSSTransitionProps, 'mountOnEnter'> {
  children: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
  horizontal?: boolean;
}

export interface CollapseTransitionElement extends CSSTransitionElement {
  _cancelled__?: boolean;
}

const CollapseTransition: React.FunctionComponent<CollapseTransitionProp> = (props) => {
  const {
    horizontal,
    beforeAppear: _beforeAppear,
    appear: _appear,
    appearCancelled: _appearCancelled,
    afterAppear: _afterAppear,
    beforeEnter,
    enter,
    enterCancelled,
    afterEnter,
    beforeLeave,
    leave,
    leaveCancelled,
    afterLeave,
    beforeDisappear: _beforeDisappear,
    disappear: _disappear,
    disappearCancelled: _disappearCancelled,
    afterDisappear: _afterDisappear,
    ...others
  } = props;

  const beforeAppear = _beforeAppear || beforeEnter;
  const appear = _appear || enter;
  const appearCancelled = _appearCancelled || enterCancelled;
  const afterAppear = _afterAppear || afterEnter;
  const beforeDisappear = _beforeDisappear || beforeLeave;
  const disappear = _disappear || beforeLeave;
  const disappearCancelled = _disappearCancelled || leaveCancelled;
  const afterDisappear = _afterDisappear || afterLeave;

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

  const beforeEnterOrAppear = useEventCallback((isAppear?: boolean) => {
    const { padding1, padding2, size, actualSize } = mappings;
    const hook = isAppear ? beforeAppear : beforeEnter;

    const className1 = isAppear ? 'appear' : 'enter';
    const className2 = isAppear ? 'appearActive' : 'enterActive';

    return (el: CollapseTransitionElement) => {
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

      hook?.(el);
    };
  });

  const enterOrAppear = useEventCallback((isAppear?: boolean) => {
    const { padding1, padding2, size, actualSize } = mappings;
    const hook = isAppear ? appear : enter;

    return (el: CollapseTransitionElement, done: () => void, isCancelled: () => boolean) => {
      el.style[size] = `${el.dataset[actualSize]!}`;
      el.style[padding1] = el.dataset[padding1]!;
      el.style[padding2] = el.dataset[padding2]!;

      hook?.(el, done, isCancelled);
    };
  });

  const afterEnterOrAppear = useEventCallback((isAppear?: boolean) => {
    const { size } = mappings;
    const hook = isAppear ? afterAppear : afterEnter;

    return (el: CollapseTransitionElement) => {
      el.style[size] = el.dataset[size]!;
      el.style.overflow = el.dataset.overflow!;

      hook?.(el);
    };
  });

  const enterOrAppearCancelled = useEventCallback((isAppear?: boolean) => {
    const { padding1, padding2, size } = mappings;

    const hook = isAppear ? appearCancelled : enterCancelled;

    return (el: CollapseTransitionElement) => {
      el._cancelled__ = true;
      el.style[padding1] = el.dataset[padding1]!;
      el.style[padding2] = el.dataset[padding2]!;
      el.style[size] = el.dataset[size]!;
      el.style.overflow = el.dataset.overflow!;
      hook?.(el);
    };
  });

  const beforeLeaveOrDisappear = useEventCallback((isAppear?: boolean) => {
    const { padding1, padding2, size, actualSize } = mappings;

    const hook = isAppear ? beforeDisappear : beforeLeave;

    return (el: CollapseTransitionElement) => {
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
      hook?.(el);
    };
  });

  const leaveOrDisappear = useEventCallback((isAppear?: boolean) => {
    const { padding1, padding2, size } = mappings;

    const hook = isAppear ? disappear : leave;

    return (el: CollapseTransitionElement, done: () => void, isCancelled: () => boolean) => {
      forceReflow();
      el.style[padding1] = '0';
      el.style[padding2] = '0';
      el.style[size] = '0';
      hook?.(el, done, isCancelled);
    };
  });

  const afterLeaveOrDisappear = useEventCallback((isAppear?: boolean) => {
    const { padding1, padding2, size } = mappings;

    const hook = isAppear ? afterDisappear : afterLeave;

    return (el: CollapseTransitionElement) => {
      el.style[padding1] = el.dataset[padding1]!;
      el.style[padding2] = el.dataset[padding2]!;
      el.style[size] = el.dataset[size]!;
      el.style.overflow = el.dataset.overflow!;
      el.dataset.display = el.style.display || '';
      el.style.display = 'none';
      hook?.(el);
    };
  });

  const leaveOrDisappearCancelled = useEventCallback((isAppear?: boolean) => {
    const { padding1, padding2, size } = mappings;

    const hook = isAppear ? disappearCancelled : leaveCancelled;

    return (el: CollapseTransitionElement) => {
      el._cancelled__ = true;
      el.style[padding1] = el.dataset[padding1]!;
      el.style[padding2] = el.dataset[padding2]!;
      el.style[size] = el.dataset[size]!;
      el.style.overflow = el.dataset.overflow!;
      hook?.(el);
    };
  });

  const beforeAppearWrapper = React.useMemo(() => {
    return beforeEnterOrAppear(true);
  }, [beforeEnterOrAppear]);

  const appearWrapper = React.useMemo(() => {
    return enterOrAppear(true);
  }, [enterOrAppear]);

  const afterAppearWrapper = React.useMemo(() => {
    return afterEnterOrAppear(true);
  }, [afterEnterOrAppear]);

  const appearCancelledWrapper = React.useMemo(() => {
    return enterOrAppearCancelled(true);
  }, [enterOrAppearCancelled]);

  const beforeDisappearWrapper = React.useMemo(() => {
    return beforeLeaveOrDisappear(true);
  }, [beforeLeaveOrDisappear]);

  const disappearWrapper = React.useMemo(() => {
    return leaveOrDisappear(true);
  }, [leaveOrDisappear]);

  const afterDisappearWrapper = React.useMemo(() => {
    return afterLeaveOrDisappear(true);
  }, [afterLeaveOrDisappear]);

  const disappearCancelledWrapper = React.useMemo(() => {
    return leaveOrDisappearCancelled(true);
  }, [leaveOrDisappearCancelled]);

  const beforeEnterWrapper = React.useMemo(() => {
    return beforeEnterOrAppear();
  }, [beforeEnterOrAppear]);

  const enterWrapper = React.useMemo(() => {
    return enterOrAppear();
  }, [enterOrAppear]);

  const afterEnterWrapper = React.useMemo(() => {
    return afterEnterOrAppear();
  }, [afterEnterOrAppear]);

  const enterCancelledWrapper = React.useMemo(() => {
    return enterOrAppearCancelled();
  }, [enterOrAppearCancelled]);

  const beforeLeaveWrapper = React.useMemo(() => {
    return beforeLeaveOrDisappear();
  }, [beforeLeaveOrDisappear]);

  const leaveWrapper = React.useMemo(() => {
    return leaveOrDisappear();
  }, [leaveOrDisappear]);

  const afterLeaveWrapper = React.useMemo(() => {
    return afterLeaveOrDisappear();
  }, [afterLeaveOrDisappear]);

  const leaveCancelledWrapper = React.useMemo(() => {
    return leaveOrDisappearCancelled();
  }, [leaveOrDisappearCancelled]);

  return (
    <CSSTransition
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
      mountOnEnter={true}
    />
  );
};

if (isDevelopment) {
  CollapseTransition.displayName = 'CollapseTransition';

  CollapseTransition.propTypes = {
    horizontal: PropTypes.bool,
    beforeAppear: PropTypes.func,
    appear: PropTypes.func,
    appearCancelled: PropTypes.func,
    afterAppear: PropTypes.func,
    beforeEnter: PropTypes.func,
    enter: PropTypes.func,
    enterCancelled: PropTypes.func,
    afterEnter: PropTypes.func,
    beforeLeave: PropTypes.func,
    leave: PropTypes.func,
    leaveCancelled: PropTypes.func,
    afterLeave: PropTypes.func,
    beforeDisappear: PropTypes.func,
    disappear: PropTypes.func,
    disappearCancelled: PropTypes.func,
    afterDisappear: PropTypes.func,
  };
}

export default CollapseTransition;
