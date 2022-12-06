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
  AutoUpdateOptions,
  ArrowOptions,
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
  ReactNode,
} from 'react';
import Transition from '../Transition';
import Portal, { PortalContainerType } from '../Portal';
import usePropChange from '../hooks/usePropChange';
import { useTheme } from '../ThemeProvider';
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
  autoUpdateOptions?: AutoUpdateOptions;
  shiftOptions?: ShiftOptions | false;
  autoPlacementOptions?: AutoPlacementOptions | false;
  arrowOptions?: ArrowOptions;
  arrow?: ReactNode;
  className?: string;
  mountOnShow?: boolean;
  unmountOnHide?: boolean;
  onAfterClosed?: () => void;
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
        ref={forkPopperRef}
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
                transformOrigin: `${typeof originX === 'number' ? `${originX}px` : originX} ${
                  typeof originY === 'number' ? `${originY}px` : originY
                }`,
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
    popupContainer: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
      isServer ? PropTypes.any : PropTypes.instanceOf(Element),
    ]),
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
    hoverOptions: PropTypes.shape({}),
    clickOptions: PropTypes.shape({}),
    focusOptions: PropTypes.shape({}),
    contextMenuOptions: PropTypes.shape({}),
    visible: PropTypes.bool,
    defaultVisible: PropTypes.bool,
    onVisibleChange: PropTypes.func,
    offset: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    shiftOptions: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    autoPlacementOptions: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    arrowOptions: PropTypes.shape({}),
    autoUpdateOptions: PropTypes.shape({}),
    arrow: PropTypes.node,
    className: PropTypes.string,
    mountOnShow: PropTypes.bool,
    unmountOnHide: PropTypes.bool,
    onAfterClosed: PropTypes.func,
  };
}

export default Popper;
