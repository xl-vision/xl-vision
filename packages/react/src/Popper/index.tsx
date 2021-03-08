/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Instance, Placement, createPopper } from '@popperjs/core';
import clsx from 'clsx';
import CSSTransition, { CSSTransitionElement, CSSTransitionProps } from '../CSSTransition';
import useForkRef from '../hooks/useForkRef';
import Portal, { PortalContainerType } from '../Portal';
import { isDevelopment } from '../utils/env';
import useEventCallback from '../hooks/useEventCallback';
import { addClass, removeClass } from '../utils/class';
import { forceReflow } from '../utils/transition';
import { off, on } from '../utils/event';
import PopperContext from './PopperContext';
import useLifecycleState, { LifecycleState } from '../hooks/useLifecycleState';
import { increaseZindex } from '../utils/zIndexManger';
import ThemeContext from '../ThemeProvider/ThemeContext';

export type PopperTrigger = 'hover' | 'focus' | 'click' | 'contextMenu' | 'custom';

export type PopperPlacement = Placement;

export type PopperChildrenProps = {
  onClick?: React.MouseEventHandler<any>;
  onMouseEnter?: React.MouseEventHandler<any>;
  onMouseLeave?: React.MouseEventHandler<any>;
  onFocus?: React.MouseEventHandler<any>;
  onBlur?: React.MouseEventHandler<any>;
  onContextMenu?: React.MouseEventHandler<any>;
  ref?: React.Ref<any>;
};

export type PopperProps = {
  children: React.ReactElement<PopperChildrenProps>;
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
  className?: string;
  destroyOnHide?: boolean;
};

const displayName = 'Popper';

const TIME_DELAY = 100;

const Popper: React.FunctionComponent<PopperProps> = (props) => {
  const {
    children,
    popup,
    getPopupContainer,
    transitionClasses,
    trigger = 'hover',
    disablePopupEnter,
    offset,
    placement = 'auto',
    showDelay = 0,
    hideDelay = 0,
    visible: visibleProps,
    onVisibleChange,
    className,
    destroyOnHide,
    arrow,
  } = props;

  const { clsPrefix } = React.useContext(ThemeContext);

  const closeHandlersRef = React.useRef<Array<() => void>>([]);

  const addCloseHandler = React.useCallback((handler: () => void) => {
    closeHandlersRef.current.push(handler);
  }, []);

  const removeCloseHandler = React.useCallback((handler: () => void) => {
    closeHandlersRef.current = closeHandlersRef.current.filter((it) => it !== handler);
  }, []);

  const {
    addCloseHandler: parentAddCloseHandler,
    removeCloseHandler: parentRemoveCloseHandler,
  } = React.useContext(PopperContext);

  const child = React.Children.only<React.ReactElement<PopperChildrenProps>>(children);

  const [visible, setVisible] = React.useState(visibleProps || false);

  const [actualPlacement, setActualPlacement] = React.useState<PopperPlacement>(placement);

  const lifecycleStateRef = useLifecycleState();

  const popupNodeRef = React.useRef<HTMLDivElement>(null);
  const popupInnerNodeRef = React.useRef<HTMLDivElement>(null);
  const referenceRef = React.useRef<React.ReactInstance>();
  const arrowRef = React.useRef<HTMLDivElement>();
  const timerRef = React.useRef<NodeJS.Timeout>();
  const popperInstanceRef = React.useRef<Instance>();

  const forkReferenceRef = useForkRef(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    React.isValidElement(child) ? (child as any).ref : null,
    referenceRef,
  );

  const forkArrowRef = useForkRef(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    React.isValidElement(arrow) ? (arrow as any).ref : null,
    arrowRef,
  );

  const findReferenceDOM = React.useCallback(() => {
    // eslint-disable-next-line react/no-find-dom-node
    return ReactDOM.findDOMNode(referenceRef.current) as HTMLElement;
  }, []);

  const createOrUpdatePopper = useEventCallback(() => {
    let instance = popperInstanceRef.current;
    const popupEl = popupNodeRef.current!;
    if (!instance) {
      const referenceEl = findReferenceDOM();
      instance = popperInstanceRef.current = createPopper(referenceEl, popupEl, {
        placement,
        modifiers: [
          {
            name: 'arrow',
            options: {
              element: arrowRef.current,
            },
          },
        ],
      });
    }
    instance.forceUpdate();

    setActualPlacement(instance.state.placement);

    popupEl.style.zIndex = `${increaseZindex()}`;

    popupInnerNodeRef.current!.dataset.placement = instance.state.placement;
    if (arrowRef.current) {
      arrowRef.current.dataset.placement = instance.state.placement;
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const setVisibleWrapper = useEventCallback((visible: boolean) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      timerRef.current = undefined;
      if (lifecycleStateRef.current === LifecycleState.DESTORYED) {
        return;
      }
      if (!visible) {
        closeHandlersRef.current.forEach((it) => it());
      }
      setVisible(visible);
    }, Math.max(TIME_DELAY, visible ? showDelay : hideDelay));
  });

  const closeHandler = useEventCallback(() => {
    closeHandlersRef.current.forEach((it) => it());
    setTimeout(() => {
      if (lifecycleStateRef.current === LifecycleState.DESTORYED) {
        return;
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = undefined;
      }
      setVisible(false);
    }, TIME_DELAY / 2);
  });

  const handleReferenceClick: React.MouseEventHandler<any> = useEventCallback((e) => {
    if (trigger === 'click') {
      // 保证在handleClickOutside后执行
      setTimeout(() => {
        setVisibleWrapper(true);
      }, 0);
    }
    child.props?.onClick?.(e);
  });

  const handleReferenceMouseEnter: React.MouseEventHandler<any> = useEventCallback((e) => {
    if (trigger === 'hover') {
      setVisibleWrapper(true);
    }
    child.props?.onMouseEnter?.(e);
  });

  const handleReferenceMouseLeave: React.MouseEventHandler<any> = useEventCallback((e) => {
    if (trigger === 'hover') {
      setVisibleWrapper(false);
    }
    child.props?.onMouseLeave?.(e);
  });

  const handleReferenceFocus: React.MouseEventHandler<any> = useEventCallback((e) => {
    if (trigger === 'focus') {
      setVisibleWrapper(true);
    }
    child.props?.onFocus?.(e);
  });

  const handleReferenceBlur: React.MouseEventHandler<any> = useEventCallback((e) => {
    if (trigger === 'focus') {
      setVisibleWrapper(false);
    }
    child.props?.onBlur?.(e);
  });

  const handleReferenceContextMenu: React.MouseEventHandler<any> = useEventCallback((e) => {
    if (trigger === 'contextMenu') {
      // 保证在handleClickOutside后执行
      setVisibleWrapper(true);
    }
    child.props?.onContextMenu?.(e);
  });

  const handleClickOutside = useEventCallback(() => {
    if (trigger === 'click' || trigger === 'contextMenu') {
      setVisibleWrapper(false);
    }
  });

  const handlePopupClick = useEventCallback(() => {
    if (disablePopupEnter) {
      return;
    }
    if (trigger !== 'click' && trigger !== 'contextMenu') {
      return;
    }
    // 保证在handleClickOutside后执行
    setTimeout(() => {
      setVisibleWrapper(true);
    }, 0);
  });

  const handlePopupMouseEnter = useEventCallback(() => {
    if (disablePopupEnter) {
      setVisibleWrapper(false);
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
    parentAddCloseHandler(closeHandler);
    return () => {
      parentRemoveCloseHandler(closeHandler);
    };
  }, [parentAddCloseHandler, parentRemoveCloseHandler, closeHandler]);

  React.useEffect(() => {
    return () => {
      popperInstanceRef.current?.destroy();
      popperInstanceRef.current = undefined;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = undefined;
      }
    };
  }, []);

  React.useEffect(() => {
    if (visibleProps !== undefined) {
      setVisible(visibleProps);
    }
  }, [visibleProps]);

  const isFirstVisibleRef = React.useRef(false);

  React.useEffect(() => {
    // 第一次的时候，Popper不存在
    if (visible && !isFirstVisibleRef.current) {
      createOrUpdatePopper();
    }
    isFirstVisibleRef.current = true;
  }, [visible, createOrUpdatePopper]);

  React.useEffect(() => {
    onVisibleChange?.(visible);
  }, [visible, onVisibleChange]);

  React.useEffect(() => {
    on(window, 'click', handleClickOutside);
    return () => {
      off(window, 'click', handleClickOutside);
    };
  }, [handleClickOutside]);

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

  const afterLeave = useEventCallback((el: HTMLElement) => {
    if (destroyOnHide) {
      if (popperInstanceRef.current) {
        popperInstanceRef.current.destroy();
        popperInstanceRef.current = undefined;
      }
    } else {
      el.style.display = 'none';
    }
  });

  const arrowNode =
    arrow &&
    React.cloneElement(arrow, {
      ref: forkArrowRef,
    });

  const rootClassName = `${clsPrefix}-popper`;

  const innerClassName = `${rootClassName}__inner`;

  const popupInnerStyles: React.CSSProperties = {
    position: 'relative',
  };

  const offsetStr = typeof offset === 'number' ? `${offset}px` : offset;

  if (offsetStr) {
    if (/^top/.exec(actualPlacement)) {
      popupInnerStyles.marginBottom = offsetStr;
    } else if (/^bottom/.exec(actualPlacement)) {
      popupInnerStyles.marginTop = offsetStr;
    } else if (/^left/.exec(actualPlacement)) {
      popupInnerStyles.marginRight = offsetStr;
    } else {
      popupInnerStyles.marginLeft = offsetStr;
    }
  }

  const portal = (
    <Portal getContainer={getPopupContainer}>
      <PopperContext.Provider value={{ addCloseHandler, removeCloseHandler }}>
        <div
          ref={popupNodeRef}
          style={{ position: 'absolute' }}
          className={clsx(rootClassName, className)}
          onMouseEnter={handlePopupMouseEnter}
          onMouseLeave={handlePopupMouseLeave}
          onClick={handlePopupClick}
        >
          <CSSTransition
            in={visible}
            transitionClasses={transitionClasses}
            mountOnEnter={true}
            beforeEnter={beforeEnter}
            afterLeave={afterLeave}
            unmountOnLeave={destroyOnHide}
          >
            <div ref={popupInnerNodeRef} style={popupInnerStyles} className={innerClassName}>
              {arrowNode}
              {popup}
            </div>
          </CSSTransition>
        </div>
      </PopperContext.Provider>
    </Portal>
  );

  const cloneChild = React.cloneElement(child, {
    ref: forkReferenceRef,
    onClick: handleReferenceClick,
    onMouseEnter: handleReferenceMouseEnter,
    onMouseLeave: handleReferenceMouseLeave,
    onFocus: handleReferenceFocus,
    onBlur: handleReferenceBlur,
    onContextMenu: handleReferenceContextMenu,
  });

  return (
    <>
      {cloneChild}
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
    className: PropTypes.string,
    destroyOnHide: PropTypes.bool,
  };
}

export default Popper;
