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
import {
  MouseEventHandler,
  Ref,
  HTMLAttributes,
  ReactElement,
  forwardRef,
  useMemo,
  Children,
  useState,
  useCallback,
  useEffect,
  cloneElement,
  CSSProperties,
  useRef,
} from 'react';
import Transition, { TransitionProps } from '../Transition';
import Portal, { PortalContainerType } from '../Portal';
import usePropChange from '../hooks/usePropChange';
import { useTheme } from '../ThemeProvider';

export type PopperTrigger = 'hover' | 'focus' | 'click' | 'contextMenu' | 'custom';

export type PopperPlacement = Placement;

export type PopperChildrenProps = {
  onClick?: MouseEventHandler<any>;
  onMouseEnter?: MouseEventHandler<any>;
  onMouseLeave?: MouseEventHandler<any>;
  onFocus?: MouseEventHandler<any>;
  onBlur?: MouseEventHandler<any>;
  onContextMenu?: MouseEventHandler<any>;
  ref?: Ref<any>;
};

export interface PopperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactElement<PopperChildrenProps>;
  popup: ReactElement;
  popupContainer?: PortalContainerType;
  transitionClassName?:
    | TransitionProps['transitionClassName']
    | ((placement: PopperPlacement) => TransitionProps['transitionClassName']);
  trigger?: PopperTrigger | Array<PopperTrigger>;
  placement?: PopperPlacement;
  disablePopupEnter?: boolean;
  offset?: OffsetOptions;
  showDelay?: number;
  hideDelay?: number;
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  arrow?: ReactElement;
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

const Popper = forwardRef<unknown, PopperProps>((props, ref) => {
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

  const triggers = useMemo(() => {
    return Array.isArray(trigger) ? trigger : [trigger];
  }, [trigger]);

  const child: ReactElement<PopperChildrenProps> = Children.only(children);

  const [visible, setVisible] = usePropChange(defaultVisible, visibleProp, onVisibleChange);

  const [transitionVisible, setTransitionVisible] = useState(visible);

  const middlewares = useMemo<Array<Middleware>>(() => {
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

  const getPopper = useCallback(
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

  const forkRef = useForkRef((child as { ref?: Ref<unknown> }).ref, ref, reference);

  const handleTransitionExit = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  useEffect(() => {
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
    cloneElement(arrowProp, {
      'aria-hidden': true,
      ...(arrowProp as { props?: {} }).props,
      style: arrowStyle,
    });

  const rootClassName = `${clsPrefix}-popper`;

  const innerClassName = `${rootClassName}__inner`;

  const rootClasses = clsx(rootClassName, className);

  const popperStyle: CSSProperties = {
    position: mode,
    left: 0,
    top: 0,
    transform: `translate3D(${Math.round(x)}px, ${Math.round(y)}px, 0)`,
  };

  const show = visible || transitionVisible;

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
          onExited={handleTransitionExit}
          in={show}
          transitionClassName={
            typeof transitionClassName === 'function'
              ? transitionClassName(placement)
              : transitionClassName
          }
        >
          {(showValue) => (
            <div
              style={{
                position: 'relative',
                display: showValue ? '' : 'none',
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

  const cloneChild = cloneElement(child, {
    ref: forkRef,
    ...getReferenceProps({}),
  });

  const isFirstMountRef = useRef(true);

  if (!show) {
    if (mountOnShow && isFirstMountRef.current) {
      return cloneChild;
    }
    if (unmountOnHide) {
      return cloneChild;
    }
  }
  isFirstMountRef.current = false;

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
    transitionClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.func]),
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
