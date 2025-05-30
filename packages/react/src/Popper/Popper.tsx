import { CssTransitionClassNameRecord, useForkRef, useValueChange } from '@xl-vision/hooks';
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
  PopperMode,
} from '@xl-vision/usePopper';
import { isProduction, isServer } from '@xl-vision/utils';
import PropTypes, { Validator } from 'prop-types';
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
  useImperativeHandle,
} from 'react';
import useNativeElementRef from '../hooks/useNativeElementRef';
import memoStyled from '../memoStyled';
import Portal, { PortalContainerType } from '../Portal';
import { useTheme } from '../ThemeProvider';
import Transition from '../Transition';
import { RefInstance } from '../types';
import { getNodeRef } from '../utils/ref';
import { increaseZindex } from '../utils/zIndexManger';

export type PopperTrigger = 'hover' | 'focus' | 'click' | 'contextMenu';

export type PopperPlacement = Placement;

export type PopperChildrenProps = {
  onClick?: MouseEventHandler<unknown>;
  onMouseEnter?: MouseEventHandler<unknown>;
  onMouseLeave?: MouseEventHandler<unknown>;
  onFocus?: MouseEventHandler<unknown>;
  onBlur?: MouseEventHandler<unknown>;
  onContextMenu?: MouseEventHandler<unknown>;
  ref?: Ref<unknown>;
};

export type PopperProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactElement<PopperChildrenProps>;
  popup: ReactElement;
  arrow?: ReactNode;
  arrowOptions?: ArrowOptions;
  autoPlacementOptions?: AutoPlacementOptions | false;
  autoUpdateOptions?: AutoUpdateOptions;
  mode?: PopperMode;
  className?: string;
  clickOptions?: ClickOptions;
  contextMenuOptions?: ContextMenuOptions;
  defaultOpen?: boolean;
  focusOptions?: FocusOptions;
  hoverOptions?: HoverOptions;
  mountOnShow?: boolean;
  offset?: OffsetOptions;
  onAfterClosed?: () => void;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  placement?: PopperPlacement;
  popupContainer?: PortalContainerType;
  shiftOptions?: ShiftOptions | false;
  transitionClassName?: string;
  trigger?: PopperTrigger | Array<PopperTrigger> | false;
  unmountOnHide?: boolean;
};

export type PopperInstance = RefInstance<HTMLDivElement>;

const displayName = 'Popper';

const PopperRoot = memoStyled('div', {
  name: displayName,
  slot: 'Root',
})(() => {
  return {};
});

const defaultGetPopupContainer = () => document.body;

const Popper = forwardRef<PopperInstance, PopperProps>((props, ref) => {
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
    open: openProp,
    onOpenChange,
    arrow: arrowProp,
    defaultOpen = false,
    shiftOptions,
    arrowOptions,
    autoPlacementOptions,
    mode: modeProp = 'absolute',
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
      return;
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

  const [open, setOpen] = useValueChange(defaultOpen, openProp, onOpenChange);

  const [zIndex, setZIndex] = useState<number>();

  const [transitionOpen, setTransitionOpen] = useState(open);

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
      mode: modeProp,
      middlewares,
    }),
    {
      open,
      setOpen,
    },
  );

  const getPopper = useCallback(
    (el: HTMLDivElement | null) => {
      if (open) {
        popper(el);
      } else {
        popper(null);
      }
    },
    [open, popper],
  );

  const { getPopperProps, getReferenceProps } = useInteraction(
    useHover(context, {
      skip: !triggers.includes('hover'),
      ...hoverOptions,
    }),
    useClick(context, {
      skip: !triggers.includes('click'),
      ...clickOptions,
    }),
    useFocus(context, {
      skip: !triggers.includes('focus'),
      ...focusOptions,
    }),
    useContextMenu(context, {
      skip: !triggers.includes('contextMenu'),
      ...contextMenuOptions,
    }),
  );

  const rootRef = useRef<HTMLDivElement>(null);

  const forkPopperRef = useForkRef(rootRef, getPopper);

  const forkReferenceRef = useForkRef(getNodeRef(child), useNativeElementRef(reference));

  useImperativeHandle(ref, () => {
    return {
      get nativeElement() {
        return rootRef.current;
      },
    };
  }, []);

  useEffect(() => {
    if (open) {
      setTransitionOpen(true);
      setZIndex(increaseZindex());
    }
  }, [open]);

  let originX: number | string | undefined = extra.arrow?.x;
  let originY: number | string | undefined = extra.arrow?.y;

  const side = placement.split('-')[0] as Side;

  switch (side) {
    case 'top': {
      originY = '100%';
      break;
    }
    case 'bottom': {
      originY = 0;
      break;
    }
    case 'left': {
      originX = '100%';
      break;
    }
    default: {
      originX = 0;
    }
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

  const popperStyle: CSSProperties = {
    position: mode,
    left: 0,
    top: 0,
    transform: `translate3D(${Math.round(x)}px, ${Math.round(y)}px, 0)`,
    zIndex,
  };

  const handleExited = useCallback(() => {
    setTransitionOpen(false);
    onAfterClosed?.();
  }, [onAfterClosed]);

  const show = open || transitionOpen;

  const portal = (
    <Portal container={popupContainer}>
      <PopperRoot
        aria-hidden={!show}
        {...others}
        {...getPopperProps({ style: popperStyle })}
        ref={forkPopperRef}
      >
        <Transition
          in={open}
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
      </PopperRoot>
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
    defaultOpen: PropTypes.bool,
    focusOptions: PropTypes.shape({}),
    hoverOptions: PropTypes.shape({}),
    mountOnShow: PropTypes.bool,
    offset: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    open: PropTypes.bool,
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
    transitionClassName: PropTypes.string,
    trigger: PropTypes.oneOfType([
      triggerPropType,
      PropTypes.arrayOf(triggerPropType),
      ((props, propName, componentName) => {
        if (!props[propName]) {
          return null;
        }
        throw new Error(
          `Invalid prop '${propName}' supplied to '${componentName}'. Validation failed.`,
        );
      }) as Validator<false>,
    ]),
    unmountOnHide: PropTypes.bool,
    onAfterClosed: PropTypes.func,
    onOpenChange: PropTypes.func,
  };
}

export default Popper;
