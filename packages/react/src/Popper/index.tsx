/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Instance, Placement, createPopper, Modifier } from '@popperjs/core';
import clsx from 'clsx';
import CSSTransition, { CSSTransitionElement, CSSTransitionProps } from '../CSSTransition';
import useForkRef from '../hooks/useForkRef';
import Portal, { PortalContainerType } from '../Portal';
import { isDevelopment } from '../utils/env';
import useEventCallback from '../hooks/useEventCallback';
import { addClass, removeClass } from '../utils/class';
import { forceReflow } from '../utils/transition';
import { off, on } from '../utils/event';
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
  onTouchStart?: React.TouchEventHandler<any>;
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
  offset?: number;
  showDelay?: number;
  hideDelay?: number;
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  arrow?: React.ReactElement;
  className?: string;
  destroyOnHide?: boolean;
  flip?: boolean | Record<string, any>;
  preventOverflow?: boolean | Record<string, any>;
};

const displayName = 'Popper';

const TIME_DELAY = 200;

const Popper = React.forwardRef<unknown, PopperProps>((props, ref) => {
  const {
    children,
    popup,
    getPopupContainer,
    transitionClasses,
    trigger = 'hover',
    disablePopupEnter,
    offset = 0,
    placement = 'auto',
    showDelay = 0,
    hideDelay = 0,
    visible: visibleProps,
    onVisibleChange,
    className,
    destroyOnHide,
    arrow,
    flip = true,
    preventOverflow = true,
    defaultVisible = false,
  } = props;

  const { clsPrefix } = React.useContext(ThemeContext);

  const child = React.Children.only<React.ReactElement<PopperChildrenProps>>(children);

  const [visible, setVisible] = React.useState(() => {
    if (visibleProps !== undefined) {
      return visibleProps;
    }
    return defaultVisible;
  });

  const lifecycleStateRef = useLifecycleState();

  const popupNodeRef = React.useRef<HTMLDivElement>(null);
  const popupInnerNodeRef = React.useRef<HTMLDivElement>(null);
  const referenceRef = React.useRef<React.ReactInstance>();
  const arrowRef = React.useRef<HTMLDivElement>();

  const popperInstanceRef = React.useRef<Instance>();

  // 触发变更计时器
  const timerRef = React.useRef<NodeJS.Timeout>();
  const delayTimeRef = React.useRef<Array<NodeJS.Timeout>>([]);

  const forkReferenceRef = useForkRef(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    React.isValidElement(child) ? (child as any).ref : null,
    referenceRef,
    ref,
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

  const show = useEventCallback(() => {
    let instance = popperInstanceRef.current;
    const popupEl = popupNodeRef.current!;

    const modifiers: Array<Partial<Modifier<any, any>>> = [
      {
        name: 'offset',
        options: {
          offset: [0, offset],
        },
      },
      {
        name: 'arrow',
        options: {
          element: arrowRef.current,
        },
      },
      {
        name: 'eventListeners',
        enabled: true,
      },
    ];

    const preventOverflowObj: Partial<Modifier<any, any>> = {
      name: 'preventOverflow',
      enabled: false,
    };

    if (preventOverflow) {
      preventOverflowObj.enabled = true;
      if (typeof preventOverflow === 'object') {
        preventOverflowObj.options = preventOverflow;
      }
    }

    modifiers.push(preventOverflowObj);

    const flipObj: Partial<Modifier<any, any>> = {
      name: 'flip',
      enabled: false,
    };

    if (flip) {
      flipObj.enabled = true;
      if (typeof flip === 'object') {
        flipObj.options = flip;
      }
    }

    modifiers.push(flipObj);

    const referenceEl = findReferenceDOM();
    instance = popperInstanceRef.current = createPopper(referenceEl, popupEl, {
      placement,
      modifiers,
    });

    instance.forceUpdate();

    popupEl.style.zIndex = `${increaseZindex()}`;

    popupInnerNodeRef.current!.dataset.placement = instance.state.placement;
    if (arrowRef.current) {
      arrowRef.current.dataset.placement = instance.state.placement;
    }
  });

  const close = useEventCallback(() => {
    popperInstanceRef.current?.destroy();
    popperInstanceRef.current = undefined;
    if (popupNodeRef.current) {
      popupNodeRef.current.style.position = 'absolute';
    }
  });

  const setVisibleWrapper = useEventCallback((newVisible: boolean) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      timerRef.current = undefined;
      if (lifecycleStateRef.current === LifecycleState.DESTORYED) {
        return;
      }

      if (newVisible !== visible) {
        // 如果有外部传入，则不处理
        if (visibleProps === undefined) {
          setVisible(newVisible);
        }
        onVisibleChange?.(newVisible);
      }
    }, Math.max(TIME_DELAY, visible ? showDelay : hideDelay));
  });

  const handleReferenceClick: React.MouseEventHandler<any> = useEventCallback((e) => {
    if (trigger === 'click') {
      // 保证在handleClickOutside和handleContextMenuOutside后执行
      const timer = setTimeout(() => {
        setVisibleWrapper(true);
        delayTimeRef.current = delayTimeRef.current.filter((it) => it !== timer);
      }, 0);

      delayTimeRef.current.push(timer);
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

  // trigger hover start when touch start
  const handleTouchStart: React.TouchEventHandler<any> = useEventCallback((e) => {
    if (trigger === 'hover') {
      const timer = setTimeout(() => {
        delayTimeRef.current = delayTimeRef.current.filter((it) => it !== timer);
        setVisibleWrapper(true);
      }, 0);
      delayTimeRef.current.push(timer);
    }

    child.props?.onTouchStart?.(e);
  });

  // trigger hover end when touch start
  // touchend trgger this logic everywhere, so bind this event on window
  const handleTouchEnd = useEventCallback(() => {
    if (trigger === 'hover') {
      // 保证在handleTouchStart后执行
      const timer = setTimeout(() => {
        delayTimeRef.current = delayTimeRef.current.filter((it) => it !== timer);
        setVisibleWrapper(false);
      }, 0);
      delayTimeRef.current.push(timer);
    }
  });

  const handleReferenceContextMenu: React.MouseEventHandler<any> = useEventCallback((e) => {
    if (trigger === 'contextMenu') {
      // 保证在handleClickOutside和handleContextMenuOutside后执行
      const timer = setTimeout(() => {
        setVisibleWrapper(true);
        delayTimeRef.current = delayTimeRef.current.filter((it) => it !== timer);
      }, 0);

      delayTimeRef.current.push(timer);
    }
    child.props?.onContextMenu?.(e);
  });

  const handleClickOutside = useEventCallback(() => {
    if (trigger === 'click' || trigger === 'contextMenu') {
      setVisibleWrapper(false);
    }
  });

  const handleContextMenuOutside = handleClickOutside;

  const handlePopupClick = useEventCallback(() => {
    if (disablePopupEnter) {
      return;
    }
    if (trigger !== 'click' && trigger !== 'contextMenu') {
      return;
    }
    // 保证在handleClickOutside和handleContextMenuOutside后执行
    const timer = setTimeout(() => {
      delayTimeRef.current = delayTimeRef.current.filter((it) => it !== timer);
      setVisibleWrapper(true);
    }, 0);
    delayTimeRef.current.push(timer);
  });

  const handlePopupContextClick = handlePopupClick;

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
      // 清除所有延时操作
      delayTimeRef.current.forEach(clearTimeout);
      delayTimeRef.current = [];
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = undefined;
      }
      // 保证最后完成
      setVisible(visibleProps);
    }
  }, [visibleProps, setVisibleWrapper]);

  const isFirstVisibleRef = React.useRef(false);

  React.useEffect(() => {
    // 第一次的时候，Popper不存在,触发一次
    if (visible && !isFirstVisibleRef.current) {
      show();
    }
    isFirstVisibleRef.current = true;
  }, [visible, show]);

  React.useEffect(() => {
    on(window, 'click', handleClickOutside);
    on(window, 'contextmenu', handleContextMenuOutside);
    on(window, 'touchend', handleTouchEnd);
    return () => {
      off(window, 'click', handleClickOutside);
      off(window, 'contextmenu', handleContextMenuOutside);
      off(window, 'touchmove', handleTouchEnd);
    };
  }, [handleClickOutside, handleContextMenuOutside, handleTouchEnd]);

  const beforeEnter = useEventCallback((el: CSSTransitionElement) => {
    // 移除transition class对定位的干扰
    removeClass(el, el._ctc?.enterActive || '');
    removeClass(el, el._ctc?.enter || '');

    el.style.display = '';

    show();

    addClass(el, el._ctc?.enter || '');
    forceReflow();
    addClass(el, el._ctc?.enterActive || '');
  });

  const afterLeave = useEventCallback((el: HTMLElement) => {
    close();
    el.style.display = 'none';
  });

  const arrowNode =
    arrow &&
    React.cloneElement(arrow, {
      ref: forkArrowRef,
    });

  const rootClassName = `${clsPrefix}-popper`;

  const innerClassName = `${rootClassName}__inner`;

  const portal = (
    <Portal getContainer={getPopupContainer}>
      <div
        ref={popupNodeRef}
        style={{ position: 'absolute' }}
        className={clsx(rootClassName, className)}
        onMouseEnter={handlePopupMouseEnter}
        onMouseLeave={handlePopupMouseLeave}
        onClick={handlePopupClick}
        onContextMenu={handlePopupContextClick}
      >
        <CSSTransition
          in={visible}
          transitionClasses={transitionClasses}
          mountOnEnter={true}
          beforeEnter={beforeEnter}
          afterLeave={afterLeave}
          unmountOnLeave={destroyOnHide}
        >
          <div
            ref={popupInnerNodeRef}
            style={{
              position: 'relative',
            }}
            className={innerClassName}
          >
            {arrowNode}
            {popup}
          </div>
        </CSSTransition>
      </div>
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
    onTouchStart: handleTouchStart,
  });

  return (
    <>
      {cloneChild}
      {portal}
    </>
  );
});

if (isDevelopment) {
  Popper.displayName = displayName;

  Popper.propTypes = {
    children: PropTypes.element.isRequired,
    popup: PropTypes.element.isRequired,
    getPopupContainer: PropTypes.func,
    transitionClasses: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    trigger: PropTypes.oneOf<PopperTrigger>(['click', 'contextMenu', 'custom', 'focus', 'hover']),
    disablePopupEnter: PropTypes.bool,
    offset: PropTypes.number,
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
    flip: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    preventOverflow: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    defaultVisible: PropTypes.bool,
  };
}

export default Popper;
