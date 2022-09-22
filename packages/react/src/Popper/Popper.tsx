import PropTypes from 'prop-types';
import clsx from 'clsx';
import { isProduction, isServer, oneOf } from '@xl-vision/utils';
import {
  Placement,
  useConnectInteraction,
  useAutoUpdatePopper,
  shift,
  offset,
  arrow,
  Middleware,
  OffsetOptions,
  useInteraction,
  useHover,
  Side,
  ShiftOptions,
  autoPlacement,
  AutoPlacementOptions,
  useClick,
  useFocus,
  HoverOptions,
  ClickOptions,
  ContextMenuOptions,
  useContextMenu,
} from '@xl-vision/popper';
import { CssTransitionClassNameRecord, useForkRef } from '@xl-vision/hooks';
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
import Transition from '../Transition';
import Portal, { PortalContainerType } from '../Portal';
import usePropChange from '../hooks/usePropChange';
import { useTheme } from '../ThemeProvider';

export type PopperTrigger = 'hover' | 'focus' | 'click' | 'contextMenu';

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

export type PopperProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactElement<PopperChildrenProps>;
  popup: ReactElement;
  popupContainer?: PortalContainerType;
  transitionClassName?: string;
  trigger?: PopperTrigger | Array<PopperTrigger> | false;
  placement?: PopperPlacement;
  hoverOptions?: HoverOptions;
  clickOptions?: ClickOptions;
  focusOptions?: FocusOptions;
  contextMenuOptions?: ContextMenuOptions;
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  offset?: OffsetOptions;
  shiftOptions?: ShiftOptions & { enable?: boolean };
  autoPlacementOptions?: AutoPlacementOptions & { enable?: boolean };
  arrow?: ReactElement;
  className?: string;
  mountOnShow?: boolean;
  unmountOnHide?: boolean;
  onAfterClosed?: () => void;
};

const displayName = 'Popper';

const defaultGetPopupContainer = () => document.body;

const Popper = forwardRef<unknown, PopperProps>((props, ref) => {
  const {
    children,
    popup,
    popupContainer = defaultGetPopupContainer,
    transitionClassName,
    trigger = 'hover',
    offset: offsetProp = 0,
    placement: initialPlacement = 'top',
    hoverOptions,
    clickOptions,
    focusOptions,
    contextMenuOptions,
    visible: visibleProp,
    onVisibleChange,
    className,
    arrow: arrowProp,
    defaultVisible = false,
    shiftOptions,
    autoPlacementOptions,
    mountOnShow = true,
    unmountOnHide,
    onAfterClosed,
    ...others
  } = props;

  const { clsPrefix } = useTheme();

  const triggers = Array.isArray(trigger) ? trigger : trigger ? [trigger] : [];

  const transitionClassNameObject = useMemo(() => {
    const ret: Required<CssTransitionClassNameRecord> = {
      appearActive: `${transitionClassName}-enter-active`,
      appearFrom: `${transitionClassName}-enter-from`,
      appearTo: `${transitionClassName}-enter-to`,
      enterActive: `${transitionClassName}-enter-active`,
      enterFrom: `${transitionClassName}-enter-from`,
      enterTo: `${transitionClassName}-enter-to`,
      disappearActive: `${transitionClassName}-exit-active`,
      disappearFrom: `${transitionClassName}-exit-from`,
      disappearTo: `${transitionClassName}-exit-to`,
      exitActive: `${transitionClassName}-exit-active`,
      exitFrom: `${transitionClassName}-exit-from`,
      exitTo: `${transitionClassName}-exit-to`,
    };
    return ret;
  }, [transitionClassName]);

  const child: ReactElement<PopperChildrenProps> = Children.only(children);

  const [visible, setVisible] = usePropChange(defaultVisible, visibleProp, onVisibleChange);

  const [transitionVisible, setTransitionVisible] = useState(visible);

  const middlewares = useMemo(() => {
    const { enable: shiftEnable, ...otherShiftOptions } = shiftOptions || {};
    const { enable: autoPlacementEnable, ...otherAutoPlacementOptions } =
      autoPlacementOptions || {};

    return [
      shiftEnable && shift(otherShiftOptions),
      autoPlacementEnable && autoPlacement(otherAutoPlacementOptions),
      offset(offsetProp),
      arrow(),
    ].filter(Boolean) as Array<Middleware>;
  }, [offsetProp, shiftOptions, autoPlacementOptions]);

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
      ...hoverOptions,
    }),
    useClick(context, {
      skip: !oneOf(triggers, 'click'),
      ...clickOptions,
    }),
    useFocus(context, {
      skip: !oneOf(triggers, 'focus'),
      ...focusOptions,
    }),
    useContextMenu(context, {
      skip: !oneOf(triggers, 'contextMenu'),
      ...contextMenuOptions,
    }),
  );

  const forkRef = useForkRef((child as { ref?: Ref<unknown> }).ref, ref, reference);

  useEffect(() => {
    if (visible) {
      setTransitionVisible(true);
    }
  }, [visible]);

  const arrowStyle: CSSProperties = {
    position: 'absolute',
    left: extra.arrow?.x,
    top: extra.arrow?.y,
  };

  const side = placement.split('-')[0] as Side;

  if (side === 'top') {
    arrowStyle.top = '100%';
  } else if (side === 'bottom') {
    arrowStyle.top = 0;
  } else if (side === 'left') {
    arrowStyle.left = '100%';
  } else {
    arrowStyle.left = 0;
  }

  const arrowNode = arrowProp && (
    <div aria-hidden='true' style={arrowStyle}>
      {arrowProp}
    </div>
  );

  const rootClassName = `${clsPrefix}-popper`;

  const innerClassName = `${rootClassName}__inner`;

  const rootClasses = clsx(rootClassName, className);

  const popperStyle: CSSProperties = {
    position: mode,
    left: 0,
    top: 0,
    transform: `translate3D(${Math.round(x)}px, ${Math.round(y)}px, 0)`,
  };

  const handleExited = useCallback(() => {
    setTransitionVisible(false);
    onAfterClosed?.();
  }, [onAfterClosed]);

  const show = visible || transitionVisible;

  const portal = (
    <Portal container={popupContainer}>
      <div
        aria-hidden={!show}
        {...others}
        {...getPopperProps({ style: popperStyle })}
        ref={getPopper}
        className={rootClasses}
      >
        <Transition
          mountOnEnter={mountOnShow}
          in={visible}
          onExited={handleExited}
          transitionOnFirst={true}
          transitionClassName={transitionClassNameObject}
        >
          {(showValue) => (
            <div
              style={{
                display: showValue ? '' : 'none',
                position: 'relative',
              }}
              className={innerClassName}
              data-placement={placement}
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
    'focus',
    'hover',
  ]).isRequired;

  const FalsePropType = PropTypes.checkPropTypes();

  Popper.propTypes = {
    children: PropTypes.element.isRequired,
    popup: PropTypes.element.isRequired,
    popupContainer: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
      isServer ? PropTypes.any : PropTypes.instanceOf(Element),
    ]),
    transitionClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.func]),
    trigger: PropTypes.oneOfType([triggerPropType, PropTypes.arrayOf(triggerPropType), false]),
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
    hoverOptions: PropTypes.object,
    clickOptions: PropTypes.object,
    focusOptions: PropTypes.object,
    contextMenuOptions: PropTypes.object,
    visible: PropTypes.bool,
    defaultVisible: PropTypes.bool,
    onVisibleChange: PropTypes.func,
    offset: PropTypes.number,
    shiftOptions: PropTypes.object,
    autoPlacementOptions: PropTypes.object,
    arrow: PropTypes.element,
    className: PropTypes.string,
    mountOnShow: PropTypes.bool,
    unmountOnHide: PropTypes.bool,
    onAfterClosed: PropTypes.func,
  };
}

export default Popper;
