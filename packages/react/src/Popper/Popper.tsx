import { CssTransitionClassNameRecord, useForkRef } from '@xl-vision/hooks';
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
  AutoUpdateOptions,
  ArrowOptions,
} from '@xl-vision/popper';
import { isProduction, isServer, oneOf } from '@xl-vision/utils';
import clsx from 'clsx';
import PropTypes from 'prop-types';
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
  ReactNode,
} from 'react';
import usePropChange from '../hooks/usePropChange';
import Portal, { PortalContainerType } from '../Portal';
import { useTheme } from '../ThemeProvider';
import Transition from '../Transition';
import { increaseZindex } from '../utils/zIndexManger';

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
  arrow?: ReactNode;
  arrowOptions?: ArrowOptions;
  autoPlacementOptions?: AutoPlacementOptions | false;
  autoUpdateOptions?: AutoUpdateOptions;
  className?: string;
  clickOptions?: ClickOptions;
  contextMenuOptions?: ContextMenuOptions;
  defaultVisible?: boolean;
  focusOptions?: FocusOptions;
  hoverOptions?: HoverOptions;
  mountOnShow?: boolean;
  offset?: OffsetOptions;
  onAfterClosed?: () => void;
  onVisibleChange?: (visible: boolean) => void;
  placement?: PopperPlacement;
  popupContainer?: PortalContainerType;
  shiftOptions?: ShiftOptions | false;
  transitionClassName?: string;
  trigger?: PopperTrigger | Array<PopperTrigger> | false;
  unmountOnHide?: boolean;
  visible?: boolean;
};

const displayName = 'Popper';

const defaultGetPopupContainer = () => document.body;

const Popper = forwardRef<HTMLDivElement, PopperProps>((props, ref) => {
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
    arrowOptions,
    autoPlacementOptions,
    mountOnShow = true,
    autoUpdateOptions,
    unmountOnHide,
    onAfterClosed,
    ...others
  } = props;

  const { clsPrefix } = useTheme();

  const triggers = Array.isArray(trigger) ? trigger : trigger ? [trigger] : [];

  const transitionClassNameObject = useMemo(() => {
    if (!transitionClassName) {
      return undefined;
    }
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

  const [zIndex, setZIndex] = useState<number>();

  const [transitionVisible, setTransitionVisible] = useState(visible);

  const middlewares = useMemo(() => {
    return [
      shiftOptions !== false && shift(shiftOptions),
      autoPlacementOptions !== false && autoPlacement(autoPlacementOptions),
      offset(offsetProp),
      arrow(arrowOptions),
    ].filter(Boolean) as Array<Middleware>;
  }, [offsetProp, shiftOptions, autoPlacementOptions, arrowOptions]);

  const { reference, popper, x, y, mode, context, extra, placement } = useConnectInteraction(
    useAutoUpdatePopper({
      ...autoUpdateOptions,
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
    (el: HTMLDivElement | null) => {
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

  const forkPopperRef = useForkRef(ref, getPopper);

  const forkReferenceRef = useForkRef((child as { ref?: Ref<unknown> }).ref, reference);

  useEffect(() => {
    if (visible) {
      setTransitionVisible(true);
      setZIndex(increaseZindex());
    }
  }, [visible]);

  let originX: number | string | undefined = extra.arrow?.x;
  let originY: number | string | undefined = extra.arrow?.y;

  const side = placement.split('-')[0] as Side;

  if (side === 'top') {
    originY = '100%';
  } else if (side === 'bottom') {
    originY = 0;
  } else if (side === 'left') {
    originX = '100%';
  } else {
    originX = 0;
  }

  const arrowNode = arrowProp && (
    <div
      aria-hidden='true'
      style={{
        position: 'absolute',
        left: originX,
        top: originY,
      }}
    >
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
    zIndex,
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
        className={rootClasses}
        ref={forkPopperRef}
      >
        <Transition
          in={visible}
          mountOnEnter={mountOnShow}
          transitionClassName={transitionClassNameObject}
          transitionOnFirst={true}
          onExited={handleExited}
        >
          {(showValue) => (
            <div
              className={innerClassName}
              data-placement={placement}
              style={{
                display: showValue ? '' : 'none',
                position: 'relative',
                transformOrigin: `${typeof originX === 'number' ? `${originX}px` : originX} ${
                  typeof originY === 'number' ? `${originY}px` : originY
                }`,
              }}
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
    ref: forkReferenceRef,
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

  Popper.propTypes = {
    children: PropTypes.element.isRequired,
    popup: PropTypes.element.isRequired,
    arrow: PropTypes.node,
    arrowOptions: PropTypes.shape({}),
    autoPlacementOptions: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    autoUpdateOptions: PropTypes.shape({}),
    className: PropTypes.string,
    clickOptions: PropTypes.shape({}),
    contextMenuOptions: PropTypes.shape({}),
    defaultVisible: PropTypes.bool,
    focusOptions: PropTypes.shape({}),
    hoverOptions: PropTypes.shape({}),
    mountOnShow: PropTypes.bool,
    offset: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
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
    popupContainer: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
      isServer ? PropTypes.any : PropTypes.instanceOf(Element),
    ]),
    shiftOptions: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    transitionClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.func]),
    trigger: PropTypes.oneOfType([
      triggerPropType,
      PropTypes.arrayOf(triggerPropType),
      (props, propName, componentName) => {
        if (!props[propName]) {
          return null;
        }
        throw new Error(
          `Invalid prop '${propName}' supplied to '${componentName}'. Validation failed.`,
        );
      },
    ]),
    unmountOnHide: PropTypes.bool,
    visible: PropTypes.bool,
    onAfterClosed: PropTypes.func,
    onVisibleChange: PropTypes.func,
  };
}

export default Popper;
