import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Portal, { PortalContainerType } from '../Portal';
import { isBrowser, isDevelopment } from '../utils/env';
import usePropChange from '../hooks/usePropChange';
import CSSTransition from '../CSSTransition';
import ThemeContext from '../ThemeProvider/ThemeContext';
import { styled } from '../styles';
import { increaseZindex } from '../utils/zIndexManger';
import { addClass, removeClass } from '../utils/class';
import { forceReflow } from '../utils/transition';
import ScrollLocker from '../utils/ScrollLocker';
import useForkRef from '../hooks/useForkRef';
import { contains } from '../utils/dom';

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  getContainer?: PortalContainerType;
  children: React.ReactNode;
  defaultVisible?: boolean;
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  destroyOnClose?: boolean;
  mountOnOpen?: boolean;
  escClosable?: boolean;
  mask?: boolean;
  maskClosable?: boolean;
  wrapperClassName?: string;
}

const displayName = 'Modal';

const ModalRoot = styled('div', {
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

const ModalMask = styled('div', {
  name: displayName,
  slot: 'Mask',
})(({ theme }) => {
  const { clsPrefix, transition } = theme;
  return {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    [`&.${clsPrefix}-modal__mask`]: {
      '&-enter-active': {
        transition: transition.enter('opacity'),
      },
      '&-leave-active': {
        transition: transition.leavePermanent('opacity'),
      },
      '&-enter-from,&-leave-to': {
        opacity: 0,
      },
      '&-leave-from,&-enter-to': {
        opacity: 1,
      },
    },
  };
});

const ModalContent = styled('div', {
  name: displayName,
  slot: 'Content',
})(({ theme }) => {
  const { clsPrefix, transition } = theme;
  return {
    position: 'relative',
    outline: 0,
    [`&.${clsPrefix}-modal__body`]: {
      '&-enter-active': {
        transition: transition.enter(['opacity', 'transform']),
      },
      '&-leave-active': {
        transition: transition.leavePermanent(['opacity', 'transform']),
      },
      '&-enter-from,&-leave-to': {
        opacity: 0,
      },
      '&-leave-from,&-enter-to': {
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
  document.documentElement.addEventListener('click', getClickPosition, true);
}

let modalManagers: Array<HTMLElement> = [];

const defaultGetContainer = () => document.body;

const scrollLocker = new ScrollLocker({ getContainer: defaultGetContainer });

const Modal = React.forwardRef<HTMLDivElement, ModalProps>((props, ref) => {
  const {
    getContainer = defaultGetContainer,
    children,
    defaultVisible = false,
    visible: visibleProp,
    onVisibleChange,
    destroyOnClose,
    mountOnOpen = true,
    mask = true,
    maskClosable = true,
    escClosable = true,
    className,
    style,
    wrapperClassName,
    ...others
  } = props;

  const { clsPrefix } = React.useContext(ThemeContext);

  const [visible, setVisible] = usePropChange(defaultVisible, visibleProp, onVisibleChange);

  const [animatedVisible, setAnimatedVisible] = React.useState(visible);

  const [zIndex, setZIndex] = React.useState<number>();

  const isFirstMountRef = React.useRef(true);

  const transitionCount = React.useRef(0);

  const bodyRef = React.useRef<HTMLDivElement>(null);

  const containerRef = React.useRef<HTMLDivElement>(null);

  const forkRef = useForkRef(containerRef, ref);

  const isTop = React.useCallback(() => {
    return modalManagers[modalManagers.length - 1] === bodyRef.current;
  }, []);

  React.useEffect(() => {
    const body = bodyRef.current;
    const container = containerRef.current;

    if (!visible || !body || !container) {
      return;
    }

    let activeElement: HTMLElement;
    if (!contains(container, document.activeElement)) {
      activeElement = document.activeElement as HTMLElement;
    }

    modalManagers.push(body);
    const handleFocusIn = (e: FocusEvent) => {
      if (!isTop()) {
        return;
      }
      const target = e.target as Element;
      if (contains(container, target)) {
        return;
      }
      body.focus();
    };
    document.addEventListener('focusin', handleFocusIn, true);
    return () => {
      document.removeEventListener('focusin', handleFocusIn, true);
      modalManagers = modalManagers.filter((it) => it !== body);
      if (modalManagers.length) {
        const modalEl = modalManagers[modalManagers.length - 1];
        if (contains(modalEl, activeElement)) {
          activeElement.focus();
        } else {
          modalEl.focus();
        }
      } else {
        activeElement?.focus();
      }
    };
  }, [visible, isTop]);

  React.useEffect(() => {
    if (!visible) {
      return;
    }
    setZIndex(increaseZindex());
    scrollLocker.lock();
    return () => {
      scrollLocker.unlock();
    };
  }, [visible]);

  const rootClassName = `${clsPrefix}-modal`;

  const beforeEnter = React.useCallback((el: HTMLElement) => {
    el.style.display = '';
    if (transitionCount.current <= 0) {
      setAnimatedVisible(true);
    }
    transitionCount.current++;
  }, []);

  const bodyClassName = `${rootClassName}__body`;

  const modalBeforeEnter = React.useCallback(
    (el: HTMLElement) => {
      beforeEnter(el);
      removeClass(el, `${bodyClassName}-enter-from`);
      removeClass(el, `${bodyClassName}-enter-active`);
      const { x, y } = el.getBoundingClientRect();
      el.style.transformOrigin = mousePosition
        ? `${mousePosition.x - x}px ${mousePosition.y - y}px`
        : '50% 50%';
      addClass(el, `${bodyClassName}-enter-from`);
      forceReflow();
      addClass(el, `${bodyClassName}-enter-active`);

      el.focus();
    },
    [bodyClassName, beforeEnter],
  );

  const afterLeave = React.useCallback((el: HTMLElement) => {
    transitionCount.current--;
    if (transitionCount.current <= 0) {
      transitionCount.current = 0;
      setAnimatedVisible(false);
    }
    el.style.display = 'none';
  }, []);

  const handleMaskClick = React.useCallback(() => {
    if (!maskClosable) {
      return;
    }
    setVisible(false);
  }, [setVisible, maskClosable]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (escClosable && e.key === 'Escape' && isTop()) {
        setVisible(false);
      }
    },
    [isTop, escClosable, setVisible],
  );

  const handleClick = React.useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (bodyRef.current && contains(bodyRef.current, target)) {
      return;
    }
    bodyRef.current?.focus();
  }, []);

  const hidden = !visible && !animatedVisible;

  if (hidden) {
    isFirstMountRef.current = false;
  }

  if (isFirstMountRef.current) {
    if (mountOnOpen && hidden) {
      return null;
    }
  } else if (destroyOnClose && hidden) {
    return null;
  }

  return (
    <Portal getContainer={getContainer}>
      <ModalRoot
        aria-hidden={hidden}
        className={clsx(rootClassName, wrapperClassName)}
        ref={forkRef}
        style={{ ...style, zIndex, display: hidden ? 'none' : '' }}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
      >
        {mask && (
          <CSSTransition
            transitionClasses={`${rootClassName}__mask`}
            in={visible}
            mountOnEnter={true}
            beforeEnter={beforeEnter}
            afterLeave={afterLeave}
          >
            <ModalMask
              aria-hidden={true}
              className={`${rootClassName}__mask`}
              onClick={handleMaskClick}
            />
          </CSSTransition>
        )}
        <CSSTransition
          transitionClasses={bodyClassName}
          in={visible}
          mountOnEnter={true}
          beforeEnter={modalBeforeEnter}
          afterLeave={afterLeave}
        >
          <ModalContent
            {...others}
            tabIndex={-1}
            className={clsx(bodyClassName, className)}
            ref={bodyRef}
          >
            {children}
          </ModalContent>
        </CSSTransition>
      </ModalRoot>
    </Portal>
  );
});

if (isDevelopment) {
  Modal.displayName = displayName;
  Modal.propTypes = {
    getContainer: PropTypes.any,
    children: PropTypes.node.isRequired,
    defaultVisible: PropTypes.bool,
    visible: PropTypes.bool,
    onVisibleChange: PropTypes.func,
    destroyOnClose: PropTypes.bool,
    mountOnOpen: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
    mask: PropTypes.bool,
    maskClosable: PropTypes.bool,
    escClosable: PropTypes.bool,
    wrapperClassName: PropTypes.string,
  };
}

export default Modal;
