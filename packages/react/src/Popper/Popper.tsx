/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { isProduction, isServer, oneOf } from '@xl-vision/utils';
import {
  Placement,
  PopperMode,
  useConnectInteraction,
  useAutoUpdatePopper,
  shift,
  offset,
  arrow,
  Middleware,
  OffsetOptions,
  useInteraction,
  useHover,
} from '@xl-vision/popper';
import { useForkRef } from '@xl-vision/hooks';
import Transition, { TransitionProps } from '../Transition';
import Portal, { PortalContainerType } from '../Portal';
import usePropChange from '../hooks/usePropChange';
import { useTheme } from '../ThemeProvider';

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

export interface PopperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactElement<PopperChildrenProps>;
  popup: React.ReactElement;
  popupContainer?: PortalContainerType;
  transitionClassName?: TransitionProps['transitionClassName'];
  trigger?: PopperTrigger | Array<PopperTrigger>;
  placement?: PopperPlacement;
  disablePopupEnter?: boolean;
  offset?: OffsetOptions;
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
  mode?: PopperMode;
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
    offset: offsetProp = 0,
    placement: initialPlacement = 'top',
    showDelay = 0,
    hideDelay = 0,
    visible: visibleProp,
    onVisibleChange,
    className,
    arrow: arrowProp,
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

  const triggers = React.useMemo(() => {
    return Array.isArray(trigger) ? trigger : [trigger];
  }, [trigger]);

  const child: React.ReactElement<PopperChildrenProps> = React.Children.only(children);

  const [visible, setVisible] = usePropChange(defaultVisible, visibleProp, onVisibleChange);

  const [transitionVisible, setTransitionVisible] = React.useState(visible);

  const middlewares = React.useMemo<Array<Middleware>>(() => {
    return [shift(), offset(offsetProp), arrow()];
  }, [offsetProp]);

  const { reference, popper, x, y, mode, context, extra, placement } = useConnectInteraction(
    useAutoUpdatePopper({
      placement: initialPlacement,
      mode: 'absolute',
      middlewares,
    }),
    {
      open: visible,
      setOpen: setVisible,
    },
  );

  const getPopper = React.useCallback(
    (el: HTMLElement | null) => {
      if (visible) {
        popper(el);
      } else {
        popper(null);
      }
    },
    [visible, popper],
  );

  const { getPopperProps, getReferenceProps } = useInteraction(
    useHover(context, {
      skip: !oneOf(triggers, 'hover'),
    }),
  );

  const forkRef = useForkRef((child as { ref?: React.Ref<unknown> }).ref, ref, reference);

  const handleTransitionExit = React.useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  React.useEffect(() => {
    if (visible) {
      setTransitionVisible(true);
    }
  }, [visible]);

  const arrowStyle = {
    position: 'absolute',
    left: extra.arrow?.x,
    top: extra.arrow?.y,
  };

  const arrowNode =
    arrowProp &&
    React.cloneElement(arrowProp, {
      'aria-hidden': true,
      ...(arrowProp as { props?: {} }).props,
      style: arrowStyle,
    });

  const rootClassName = `${clsPrefix}-popper`;

  const innerClassName = `${rootClassName}__inner`;

  const rootClasses = clsx(rootClassName, className);

  const popperStyle: React.CSSProperties = {
    position: mode,
    left: 0,
    top: 0,
    transform: `translate3D(${Math.round(x)}px, ${Math.round(y)}px, 0)`,
  };

  const portal = (
    <Portal container={popupContainer}>
      <div
        aria-hidden={!visible}
        {...others}
        {...getPopperProps({ style: popperStyle })}
        ref={getPopper}
        className={rootClasses}
      >
        <Transition
          mountOnEnter={mountOnShow}
          unmountOnExit={unmountOnHide}
          onExited={handleTransitionExit}
          in={visible || transitionVisible}
          transitionClassName={transitionClassName}
        >
          {(show) => (
            <div
              style={{
                position: 'relative',
                display: show ? '' : 'none',
              }}
              className={innerClassName}
            >
              {arrowNode}
              {popup}
            </div>
          )}
        </Transition>
      </div>
    </Portal>
  );

  const cloneChild = React.cloneElement(child, {
    ref: forkRef,
    ...getReferenceProps({}),
  });

  return (
    <>
      {cloneChild}
      {visible && portal}
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
