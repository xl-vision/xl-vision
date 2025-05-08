import { useValueChange } from '@xl-vision/hooks';
import {
  contains,
  getBoundingClientRect,
  isBrowser,
  isProduction,
  isServer,
  removeClass,
  addClass,
  warning,
} from '@xl-vision/utils';
import PropTypes from 'prop-types';
import {
  HTMLAttributes,
  ReactNode,
  forwardRef,
  useState,
  useRef,
  useCallback,
  useEffect,
  KeyboardEvent,
  MouseEvent as ReactMouseEvent,
  useImperativeHandle,
} from 'react';
import memoStyled from '../memoStyled';
import Portal, { PortalContainerType } from '../Portal';
import { useTheme } from '../ThemeProvider';
import Transition from '../Transition';
import { RefInstance } from '../types';
import { forceReflow } from '../utils/dom';
import getContainer from '../utils/getContainer';
import ScrollLocker from '../utils/ScrollLocker';
import { increaseZindex } from '../utils/zIndexManger';

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  container?: PortalContainerType<HTMLElement>;
  defaultOpen?: boolean;
  escClosable?: boolean;
  mask?: boolean;
  maskClosable?: boolean;
  mountOnShow?: boolean;
  onAfterClosed?: () => void;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  unmountOnHide?: boolean;
  wrapperClassName?: string;
}

export type ModalInstance = RefInstance<HTMLDivElement>;

const displayName = 'Modal';

const ModalRoot = memoStyled('div', {
  name: displayName,
  slot: 'Root',
})(() => {
  return {
    position: 'fixed',
    inset: 0,
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
});

const ModalMask = memoStyled('div', {
  name: displayName,
  slot: 'Mask',
})(({ theme }) => {
  const { transitions, colors, clsPrefix } = theme;
  return {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    backgroundColor: colors.background.mask,
    [`&.${clsPrefix}-modal__mask`]: {
      '&-enter-active': {
        transition: transitions.enter('opacity'),
      },
      '&-exit-active': {
        transition: transitions.exit('opacity'),
      },
      '&-enter-from,&-exit-to': {
        opacity: 0,
      },
      '&-exit-from,&-enter-to': {
        opacity: 1,
      },
    },
  };
});

const ModalBody = memoStyled('div', {
  name: displayName,
  slot: 'Body',
})(({ theme }) => {
  const { clsPrefix, transitions } = theme;
  return {
    position: 'relative',
    outline: 0,
    [`&.${clsPrefix}-modal__body`]: {
      '&-enter-active': {
        transition: transitions.enter(['opacity', 'transform']),
      },
      '&-exit-active': {
        transition: transitions.exit(['opacity', 'transform']),
      },
      '&-enter-from,&-exit-to': {
        opacity: 0,
      },
      '&-exit-from,&-enter-to': {
        opacity: 1,
      },
      '&-enter-from': {
        transform: 'scale(0)',
      },
      '&-enter-to': {
        transform: 'scale(1)',
      },
    },
  };
});

let mousePosition: { x: number; y: number } | null;

const getClickPosition = (e: MouseEvent) => {
  // fix bug when click event triggered by press key enter
  if (!e.clientX && !e.clientY) {
    return;
  }
  mousePosition = {
    x: e.clientX,
    y: e.clientY,
  };
  // 100ms 内发生过点击事件，则从点击位置动画展示
  // 否则直接 zoom 展示
  // 这样可以兼容非点击方式展开
  setTimeout(() => {
    mousePosition = null;
  }, 100);
};

// 只有点击事件支持从鼠标位置动画展开
if (isBrowser) {
  document.addEventListener('click', getClickPosition, true);
}

let modalManagers: Array<HTMLElement> = [];

const defaultGetContainer = () => document.body;

const Modal = forwardRef<ModalInstance, ModalProps>((props, ref) => {
  const {
    container: containerProp = defaultGetContainer,
    children,
    defaultOpen = false,
    open: openProp,
    onOpenChange,
    unmountOnHide,
    mountOnShow = true,
    mask = true,
    maskClosable = true,
    escClosable = true,
    wrapperClassName,
    onAfterClosed,
    ...others
  } = props;

  const { clsPrefix } = useTheme();

  const [open, setOpen] = useValueChange(defaultOpen, openProp, onOpenChange);

  const [animatedOpen, setAnimatedOpen] = useState(open);

  const [zIndex, setZIndex] = useState<number>();

  const bodyRef = useRef<HTMLDivElement>(null);
  const isFirstMountRef = useRef(true);

  const rootRef = useRef<HTMLDivElement>(null);

  const innerFocusRef = useRef(false);

  const scrollLockerRef = useRef<ScrollLocker>(null);

  const [container, setContainer] = useState<HTMLElement | null>();

  useImperativeHandle(ref, () => {
    return {
      get nativeElement() {
        return rootRef.current;
      },
    };
  }, []);

  const isTop = useCallback(() => {
    return modalManagers[modalManagers.length - 1] === bodyRef.current;
  }, []);

  const inProp = open && animatedOpen;

  const transitionCount = useRef(inProp ? (mask ? 2 : 1) : 0);

  useEffect(() => {
    let node: HTMLElement | null | undefined = getContainer(containerProp);

    if (node == null && rootRef.current) {
      node = rootRef.current.parentElement;
      warning(!node, `<Modal> parentElement is undefined`);
    }

    setContainer(node);
  }, [containerProp]);

  useEffect(() => {
    const body = bodyRef.current;
    const modalNode = rootRef.current;

    if (!inProp || !body || !modalNode) {
      return;
    }
    modalManagers.push(body);

    // record last active element
    const lastActiveElement = document.activeElement as HTMLElement;

    body.focus();

    const handleFocusIn = (e: FocusEvent) => {
      if (innerFocusRef.current) {
        innerFocusRef.current = false;
        return;
      }
      if (!isTop()) {
        return;
      }
      const target = e.target as Element;
      if (contains(modalNode, target)) {
        return;
      }
      body.focus();
    };

    document.addEventListener('focusin', handleFocusIn, true);
    return () => {
      modalManagers = modalManagers.filter((it) => it !== body);
      document.removeEventListener('focusin', handleFocusIn, true);
      if (modalManagers.length) {
        const modalEl = modalManagers[modalManagers.length - 1];
        // if last active element in modal, focus on it again
        if (contains(modalEl, lastActiveElement)) {
          lastActiveElement.focus();
        } else {
          modalEl.focus();
        }
      } else {
        lastActiveElement?.focus();
      }
    };
  }, [inProp, isTop]);

  useEffect(() => {
    const scrollLocker = new ScrollLocker({ getContainer: () => container || document.body });
    scrollLockerRef.current = scrollLocker;
    return () => {
      if (scrollLocker.locked) {
        scrollLocker.unlock();
      }
    };
  }, [container]);

  useEffect(() => {
    if (!open) {
      return;
    }
    setAnimatedOpen(true);
    setZIndex(increaseZindex());

    const scrollLocker = scrollLockerRef.current;

    if (scrollLocker && !scrollLocker.locked) {
      scrollLocker.lock();
    }
  }, [open]);

  const rootClassName = `${clsPrefix}-modal`;

  const handleEnter = useCallback(() => {
    transitionCount.current++;
  }, []);

  const bodyClassName = `${rootClassName}__body`;

  const handleModalEnter = useCallback(
    (nativeEl: Element) => {
      const el = nativeEl as HTMLElement;
      handleEnter();
      removeClass(el, `${bodyClassName}-enter-from`);
      removeClass(el, `${bodyClassName}-enter-active`);
      const { x, y } = getBoundingClientRect(el);
      el.style.transformOrigin = mousePosition
        ? `${mousePosition.x - x}px ${mousePosition.y - y}px`
        : '50% 50%';
      addClass(el, `${bodyClassName}-enter-from`);
      forceReflow();
      addClass(el, `${bodyClassName}-enter-active`);
    },
    [bodyClassName, handleEnter],
  );

  const handleExited = useCallback(() => {
    transitionCount.current--;
    // 确保遮罩动画和modal动画都完成后再解锁
    if (transitionCount.current <= 0) {
      transitionCount.current = 0;
      setAnimatedOpen(false);
      onAfterClosed?.();
      // 动画结束后解除锁定
      const scrollLocker = scrollLockerRef.current;
      if (scrollLocker && scrollLocker.locked) {
        scrollLocker.unlock();
      }
    }
  }, [setAnimatedOpen, onAfterClosed]);

  const handleMaskClick = useCallback(() => {
    if (!maskClosable) {
      return;
    }
    setOpen(false);
  }, [setOpen, maskClosable]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (escClosable && e.key === 'Escape' && isTop()) {
        setOpen(false);
      }
    },
    [isTop, escClosable, setOpen],
  );

  const handleClick = useCallback((e: ReactMouseEvent) => {
    const target = e.target as HTMLElement;
    if (bodyRef.current && contains(bodyRef.current, target)) {
      return;
    }
    bodyRef.current?.focus();
  }, []);

  const handleInnerFocus = useCallback(() => {
    innerFocusRef.current = true;
  }, []);

  const hidden = !open && !animatedOpen;

  if (!hidden) {
    isFirstMountRef.current = false;
  }

  if (isFirstMountRef.current) {
    if (mountOnShow && hidden) {
      return null;
    }
  } else if (unmountOnHide && hidden) {
    return null;
  }

  return (
    <Portal container={containerProp}>
      <ModalRoot
        aria-hidden={!open}
        className={wrapperClassName}
        ref={rootRef}
        style={{ zIndex, display: hidden ? 'none' : '' }}
        onClick={handleClick}
        onFocus={handleInnerFocus}
        onKeyDown={handleKeyDown}
      >
        {mask && (
          <Transition
            in={inProp}
            mountOnEnter={true}
            transitionClassName={`${rootClassName}__mask`}
            onEnter={handleEnter}
            onExited={handleExited}
          >
            {(show) => (
              <ModalMask
                aria-hidden={true}
                style={{
                  display: show ? '' : 'none',
                }}
                onClick={handleMaskClick}
              />
            )}
          </Transition>
        )}
        <Transition
          in={inProp}
          mountOnEnter={true}
          transitionClassName={bodyClassName}
          onEnter={handleModalEnter}
          onExited={handleExited}
        >
          {(show) => (
            <ModalBody
              {...others}
              ref={bodyRef}
              style={{
                display: show ? '' : 'none',
              }}
              tabIndex={-1}
            >
              {children}
            </ModalBody>
          )}
        </Transition>
      </ModalRoot>
    </Portal>
  );
});

if (!isProduction) {
  Modal.displayName = displayName;
  Modal.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    container: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
      isServer ? PropTypes.any : PropTypes.instanceOf(HTMLElement),
    ]),
    defaultOpen: PropTypes.bool,
    escClosable: PropTypes.bool,
    mask: PropTypes.bool,
    maskClosable: PropTypes.bool,
    mountOnShow: PropTypes.bool,
    open: PropTypes.bool,
    style: PropTypes.shape({}),
    unmountOnHide: PropTypes.bool,
    wrapperClassName: PropTypes.string,
    onAfterClosed: PropTypes.func,
    onOpenChange: PropTypes.func,
  };
}

export default Modal;
