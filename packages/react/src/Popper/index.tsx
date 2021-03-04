import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Instance, Placement, createPopper, Modifier } from '@popperjs/core';
import CSSTransition, { CSSTransitionElement, CSSTransitionProps } from '../CSSTransition';
import useForkRef from '../hooks/useForkRef';
import Portal, { PortalContainerType } from '../Portal';
import { isDevelopment } from '../utils/env';
import { off, on } from '../utils/event';
import useEventCallback from '../hooks/useEventCallback';
import { include } from '../utils/dom';
import { addClass, removeClass } from '../utils/class';
import { forceReflow } from '../utils/transition';

export type PopperTrigger = 'hover' | 'focus' | 'click' | 'contextMenu' | 'custom';

export type PopperPlacement = Placement;

export type PopperProps = {
  children: React.ReactElement;
  popup: React.ReactElement;
  getPopupContainer?: PortalContainerType;
  transitionClasses?: CSSTransitionProps['transitionClasses'];
  trigger?: PopperTrigger;
  placement?: PopperPlacement;
  disablePopupEnter?: boolean;
  offset?: number | string;
  showDelay?: number;
  hideDelay?: number;
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  arrow?: React.ReactElement;
  popupClassName?: string;
};

const displayName = 'Popper';

const TIME_DELAY = 1000 / 60;

const Popper: React.FunctionComponent<PopperProps> = (props) => {
  const {
    children,
    popup,
    getPopupContainer,
    transitionClasses,
    trigger = 'hover',
    disablePopupEnter,
    offset = 10,
    placement = 'auto',
    showDelay = 0,
    hideDelay = 0,
    visible: visibleProps,
    onVisibleChange,
    popupClassName,
    arrow,
  } = props;

  const child = React.Children.only(children);

  const [visible, setVisible] = React.useState(visibleProps || false);

  const popupNodeRef = React.useRef<HTMLDivElement>(null);
  const popupInnerNodeRef = React.useRef<HTMLDivElement>(null);
  const referenceRef = React.useRef<React.ReactInstance>();
  const timerRef = React.useRef<NodeJS.Timeout>();
  const popperInstanceRef = React.useRef<Instance>();

  const forkReferenceRef = useForkRef(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    React.isValidElement(child) ? (child as any).ref : null,
    referenceRef,
  );

  const findReferenceDOM = React.useCallback(() => {
    // eslint-disable-next-line react/no-find-dom-node
    return ReactDOM.findDOMNode(referenceRef.current) as HTMLElement;
  }, []);

  const offsetModifer: Modifier<string, {}> = React.useMemo(() => {
    const offsetStr = typeof offset === 'number' ? `${offset}px` : offset;

    return {
      name: 'paddingOffset',
      enabled: true,
      phase: 'main',
      fn({ state }) {
        const style: Partial<CSSStyleDeclaration> = {};
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const { placement, styles } = state;
        if (/^bottom/.exec(placement)) {
          style.paddingTop = offsetStr;
        } else if (/^top/.exec(placement)) {
          style.paddingBottom = offsetStr;
        } else if (/^left/.exec(placement)) {
          style.paddingRight = offsetStr;
        } else {
          style.paddingLeft = offsetStr;
        }
        styles.popper = { ...styles.popper, ...style };
      },
    };
  }, [offset]);

  const modifiers: Array<Partial<Modifier<string, any>>> = React.useMemo(() => {
    return [offsetModifer];
  }, [offsetModifer]);

  const createOrUpdatePopper = useEventCallback(() => {
    let instance = popperInstanceRef.current;
    if (!instance) {
      const referenceEl = findReferenceDOM();
      const popupEl = popupNodeRef.current!;
      instance = popperInstanceRef.current = createPopper(referenceEl, popupEl, {
        placement,
        modifiers,
      });
    }
    instance.forceUpdate();
    popupInnerNodeRef.current!.dataset.placement = instance.state.placement;
  });

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const setVisibleWrapper = useEventCallback((visible: boolean) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(
      () => {
        setVisible(visible);
        timerRef.current = undefined;
      },
      visible ? showDelay : Math.max(TIME_DELAY, hideDelay),
    );
  });

  const handleReferenceClick = useEventCallback(() => {
    if (trigger === 'click') {
      setVisibleWrapper(true);
    }
  });

  const handleReferenceMouseEnter = useEventCallback(() => {
    if (trigger === 'hover') {
      setVisibleWrapper(true);
    }
  });

  const handleReferenceMouseLeave = useEventCallback(() => {
    if (trigger === 'hover') {
      setVisibleWrapper(false);
    }
  });

  const handleReferenceFocus = useEventCallback(() => {
    if (trigger === 'focus') {
      setVisibleWrapper(true);
    }
  });

  const handleReferenceBlur = useEventCallback(() => {
    if (trigger === 'focus') {
      setVisibleWrapper(false);
    }
  });

  const handleReferenceContextMenu = useEventCallback(() => {
    if (trigger === 'contextMenu') {
      setVisibleWrapper(true);
    }
  });

  const handleClickOutside = useEventCallback((e: MouseEvent | TouchEvent) => {
    if (trigger !== 'click' && trigger !== 'contextMenu') {
      return;
    }
    const el = e.target;
    if (!(el instanceof Element)) {
      return;
    }
    if (include(popupNodeRef.current!, el)) {
      if (!disablePopupEnter) {
        return;
      }
    }
    if (include(findReferenceDOM(), el)) {
      return;
    }
    setVisibleWrapper(false);
  });

  const handlePopupMouseEnter = useEventCallback(() => {
    if (disablePopupEnter) {
      return;
    }
    if (trigger === 'hover') {
      setVisibleWrapper(true);
    }
  });

  const handlePopupMouseLeave = useEventCallback(() => {
    if (trigger === 'hover') {
      setVisibleWrapper(false);
    }
  });

  React.useEffect(() => {
    const el = findReferenceDOM();
    const popupEl = popupNodeRef.current!;

    on(el, 'click', handleReferenceClick);
    on(el, 'mouseenter', handleReferenceMouseEnter);
    on(el, 'mouseleave', handleReferenceMouseLeave);
    on(el, 'focus', handleReferenceFocus);
    on(el, 'blur', handleReferenceBlur);
    on(el, 'contextmenu', handleReferenceContextMenu);

    on(popupEl, 'mouseenter', handlePopupMouseEnter);
    on(popupEl, 'mouseleave', handlePopupMouseLeave);

    on(window, 'click', handleClickOutside);
    return () => {
      off(el, 'click', handleReferenceClick);
      off(el, 'mouseenter', handleReferenceMouseEnter);
      off(el, 'mouseleave', handleReferenceMouseLeave);
      off(el, 'focus', handleReferenceFocus);
      off(el, 'blur', handleReferenceBlur);
      off(el, 'contextmenu', handleReferenceContextMenu);

      off(popupEl, 'mouseenter', handlePopupMouseEnter);
      off(popupEl, 'mouseleave', handlePopupMouseLeave);

      off(window, 'click', handleClickOutside);
    };
  }, [
    findReferenceDOM,
    handleReferenceClick,
    handleReferenceMouseEnter,
    handleReferenceMouseLeave,
    handleReferenceFocus,
    handleReferenceBlur,
    handleReferenceContextMenu,
    handleClickOutside,
    handlePopupMouseEnter,
    handlePopupMouseLeave,
  ]);

  React.useEffect(() => {
    return () => {
      popperInstanceRef.current?.destroy();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    if (visibleProps !== undefined) {
      setVisible(visibleProps);
      // 第一次的时候，Popper不存在
      if (!popperInstanceRef.current && visibleProps) {
        createOrUpdatePopper();
      }
    }
  }, [visibleProps, createOrUpdatePopper]);

  React.useEffect(() => {
    onVisibleChange?.(visible);
  }, [visible, onVisibleChange]);

  const beforeEnter = useEventCallback((el: CSSTransitionElement) => {
    // 移除transition class对定位的干扰
    removeClass(el, el._ctc?.enterActive || '');
    removeClass(el, el._ctc?.enter || '');

    el.style.display = '';

    createOrUpdatePopper();

    addClass(el, el._ctc?.enter || '');
    forceReflow();
    addClass(el, el._ctc?.enterActive || '');
  });

  const afterLeave = React.useCallback((el: HTMLElement) => {
    el.style.display = 'none';
  }, []);

  const arrowNode =
    arrow &&
    React.cloneElement(arrow, {
      'data-popper-arrow': '',
    });

  const portal = (
    <Portal getContainer={getPopupContainer}>
      <div ref={popupNodeRef} style={{ position: 'absolute' }} className={popupClassName}>
        <CSSTransition
          in={visible}
          transitionClasses={transitionClasses}
          mountOnEnter={true}
          beforeEnter={beforeEnter}
          afterLeave={afterLeave}
        >
          <div ref={popupInnerNodeRef} style={{ position: 'relative' }}>
            {arrowNode}
            {popup}
          </div>
        </CSSTransition>
      </div>
    </Portal>
  );

  const cloneChildren = React.cloneElement(children, {
    ref: forkReferenceRef,
  });

  return (
    <>
      {cloneChildren}
      {portal}
    </>
  );
};

if (isDevelopment) {
  Popper.displayName = displayName;

  Popper.propTypes = {
    children: PropTypes.element.isRequired,
    popup: PropTypes.element.isRequired,
    getPopupContainer: PropTypes.func,
    transitionClasses: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    trigger: PropTypes.oneOf<PopperTrigger>(['click', 'contextMenu', 'custom', 'focus', 'hover']),
    disablePopupEnter: PropTypes.bool,
    offset: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    placement: PropTypes.oneOf<PopperPlacement>([
      'top',
      'top-start',
      'top-end',
      'bottom',
      'bottom-start',
      'bottom-end',
      'left',
      'left-start',
      'left-end',
      'right',
      'right-start',
      'right-end',
      'auto',
      'auto-start',
      'auto-end',
    ]),
    showDelay: PropTypes.number,
    hideDelay: PropTypes.number,
    visible: PropTypes.bool,
    onVisibleChange: PropTypes.func,
    arrow: PropTypes.element,
    popupClassName: PropTypes.string,
  };
}

export default Popper;
