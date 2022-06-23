/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { isProduction, isServer, oneOf } from '@xl-vision/utils';
import { useForkRef, Placement, usePopper, useConstantFn } from '@xl-vision/hooks';
import Transition, { TransitionProps } from '../Transition';
import Portal, { PortalContainerType } from '../Portal';
import usePropChange from '../hooks/usePropChange';
import { useTheme } from '../ThemeProvider';
import useLifecycleState, { LifecycleState } from '../hooks/useLifecycleState';
import { off, on } from '../utils/event';

export type PopperTrigger = 'hover' | 'focus' | 'click' | 'contextMenu' | 'custom';

export type PopperChildrenProps = {
  onClick?: React.MouseEventHandler<any>;
  onMouseEnter?: React.MouseEventHandler<any>;
  onMouseLeave?: React.MouseEventHandler<any>;
  onFocus?: React.MouseEventHandler<any>;
  onBlur?: React.MouseEventHandler<any>;
  onContextMenu?: React.MouseEventHandler<any>;
  ref?: React.Ref<any>;
};

export interface PopperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactElement<PopperChildrenProps>;
  popup: React.ReactElement;
  popupContainer?: PortalContainerType;
  transitionClassName?: TransitionProps['transitionClassName'];
  trigger?: PopperTrigger | Array<PopperTrigger>;
  placement?: Placement;
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
  transformOrigin?: boolean;
  mountOnShow?: boolean;
  unmountOnHide?: boolean;
  onAfterClosed?: () => void;
}

const displayName = 'Popper';

const TIME_DELAY = 200;

const defaultGetPopupContainer = () => document.body;

const Popper = React.forwardRef<unknown, PopperProps>((props, ref) => {
  const {
    children,
    popup,
    popupContainer = defaultGetPopupContainer,
    transitionClassName,
    trigger = 'hover',
    disablePopupEnter,
    offset = 0,
    placement = 'top',
    showDelay = 0,
    hideDelay = 0,
    visible: visibleProp,
    onVisibleChange,
    className,
    arrow,
    flip = true,
    preventOverflow = true,
    transformOrigin = true,
    defaultVisible = false,
    mountOnShow = true,
    unmountOnHide,
    onAfterClosed,
    ...others
  } = props;

  const { clsPrefix } = useTheme();

  const child: React.ReactElement<PopperChildrenProps> = React.Children.only(children);

  const [visible, setVisible] = usePropChange(defaultVisible, visibleProp, onVisibleChange);

  const middlewares = React.useMemo(() => {
    return [];
  }, []);

  const { update, reference, popper, x, y, mode } = usePopper({
    placement,
    mode: 'fixed',
    middlewares,
  });

  const forkRef = useForkRef((child as { ref?: React.Ref<unknown> }).ref, ref, reference);

  const timerRef = React.useRef<NodeJS.Timeout>();
  const delayTimeRef = React.useRef<Array<NodeJS.Timeout>>([]);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = undefined;
      }
      delayTimeRef.current.forEach((it) => {
        clearTimeout(it);
      });
    };
  }, []);

  const lifecycleStateRef = useLifecycleState();

  const setVisibleWrapper = useConstantFn((newVisible: boolean) => {
    if (timerRef.current !== undefined) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      timerRef.current = undefined;
      if (lifecycleStateRef.current === LifecycleState.DESTORYED) {
        return;
      }

      setVisible(newVisible);
    }, Math.max(TIME_DELAY, newVisible ? showDelay : hideDelay));
  });

  const show = useConstantFn(() => {
    update();
  });

  const hide = useConstantFn(() => {});

  React.useEffect(() => {
    if (visible) {
      console.log(1)
      show();
    }
  }, [visible, show]);

  const isTrigger = useConstantFn((checkedTrigger: PopperTrigger) => {
    const triggers = Array.isArray(trigger) ? trigger : [trigger];
    if (oneOf(triggers, 'custom')) {
      return false;
    }
    return oneOf(triggers, checkedTrigger);
  });

  const handleReferenceClick: React.MouseEventHandler<any> = useConstantFn((e) => {
    if (isTrigger('click')) {
      // 保证在handleClickOutside和handleContextMenuOutside后执行
      const timer = setTimeout(() => {
        setVisibleWrapper(true);
        delayTimeRef.current = delayTimeRef.current.filter((it) => it !== timer);
      }, 0);

      delayTimeRef.current.push(timer);
    }
    child.props?.onClick?.(e);
  });

  const handleReferenceMouseEnter: React.MouseEventHandler<any> = useConstantFn((e) => {
    if (isTrigger('hover')) {
      setVisibleWrapper(true);
    }
    child.props?.onMouseEnter?.(e);
  });

  const handleReferenceMouseLeave: React.MouseEventHandler<any> = useConstantFn((e) => {
    if (isTrigger('hover')) {
      setVisibleWrapper(false);
    }
    child.props?.onMouseLeave?.(e);
  });

  const handleReferenceFocus: React.MouseEventHandler<any> = useConstantFn((e) => {
    if (isTrigger('focus')) {
      setVisibleWrapper(true);
    }
    child.props?.onFocus?.(e);
  });

  const handleReferenceBlur: React.MouseEventHandler<any> = useConstantFn((e) => {
    if (isTrigger('focus')) {
      setVisibleWrapper(false);
    }
    child.props?.onBlur?.(e);
  });

  const handleReferenceContextMenu: React.MouseEventHandler<any> = useConstantFn((e) => {
    if (isTrigger('contextMenu')) {
      // 保证在handleClickOutside和handleContextMenuOutside后执行
      const timer = setTimeout(() => {
        setVisibleWrapper(true);
        delayTimeRef.current = delayTimeRef.current.filter((it) => it !== timer);
      }, 0);

      delayTimeRef.current.push(timer);
    }
    child.props?.onContextMenu?.(e);
  });

  const handleClickOutside = useConstantFn(() => {
    if (isTrigger('click') || isTrigger('contextMenu')) {
      setVisibleWrapper(false);
    }
  });

  const handleContextMenuOutside = handleClickOutside;

  const handlePopupClick = useConstantFn(() => {
    if (disablePopupEnter) {
      return;
    }
    if (isTrigger('click') || isTrigger('contextMenu')) {
      // 保证在handleClickOutside和handleContextMenuOutside后执行
      const timer = setTimeout(() => {
        delayTimeRef.current = delayTimeRef.current.filter((it) => it !== timer);
        setVisibleWrapper(true);
      }, 0);
      delayTimeRef.current.push(timer);
    }
  });

  const handlePopupContextClick = handlePopupClick;

  const handlePopupMouseEnter = useConstantFn(() => {
    if (disablePopupEnter) {
      setVisibleWrapper(false);
      return;
    }
    if (isTrigger('hover')) {
      setVisibleWrapper(true);
    }
  });

  const handlePopupMouseLeave = useConstantFn(() => {
    if (isTrigger('hover')) {
      setVisibleWrapper(false);
    }
  });

  React.useEffect(() => {
    // 在捕获阶段拦截，防止元素禁止冒泡导致监听不到
    on(window, 'click', handleClickOutside, true);
    on(window, 'contextmenu', handleContextMenuOutside, true);
    return () => {
      off(window, 'click', handleClickOutside, true);
      off(window, 'contextmenu', handleContextMenuOutside, true);
    };
  }, [handleClickOutside, handleContextMenuOutside]);

  const arrowNode =
    arrow &&
    React.cloneElement(arrow, {
      'aria-hidden': true,
      ...(arrow as { props?: {} }).props,
    });

  const rootClassName = `${clsPrefix}-popper`;

  const innerClassName = `${rootClassName}__inner`;

  const rootClasses = clsx(rootClassName, className);

  const popperStyle: React.CSSProperties = {
    position: mode,
    left: x,
    top: y,
  };

  const portal = (
    <Portal container={popupContainer}>
      <div
        aria-hidden={!visible}
        {...others}
        ref={popper}
        style={popperStyle}
        className={rootClasses}
        onMouseEnter={handlePopupMouseEnter}
        onMouseLeave={handlePopupMouseLeave}
        onClick={handlePopupClick}
        onContextMenu={handlePopupContextClick}
      >
        <div
          style={{
            position: 'relative',
          }}
          className={innerClassName}
        >
          {arrowNode}
          {popup}
        </div>
      </div>
    </Portal>
  );

  const cloneChild = React.cloneElement(child, {
    ref: forkRef,
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
});

if (!isProduction) {
  Popper.displayName = displayName;

  const triggerPropType = PropTypes.oneOf<PopperTrigger>([
    'click',
    'contextMenu',
    'custom',
    'focus',
    'hover',
  ]).isRequired;

  Popper.propTypes = {
    mountOnShow: PropTypes.bool,
    unmountOnHide: PropTypes.bool,
    children: PropTypes.element.isRequired,
    popup: PropTypes.element.isRequired,
    popupContainer: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
      isServer ? PropTypes.any : PropTypes.instanceOf(Element),
    ]),
    transitionClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    trigger: PropTypes.oneOfType([triggerPropType, PropTypes.arrayOf(triggerPropType)]),
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
    transformOrigin: PropTypes.bool,
    onAfterClosed: PropTypes.func,
  };
}

export default Popper;
