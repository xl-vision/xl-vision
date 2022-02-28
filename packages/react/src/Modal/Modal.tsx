import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { env } from '@xl-vision/utils';
import { useForkRef } from '@xl-vision/hooks';
import Portal, { PortalContainerType } from '../Portal';
import usePropChange from '../hooks/usePropChange';
import CssTransition from '../CssTransition';
import { styled } from '../styles';
import { increaseZindex } from '../utils/zIndexManger';
import { addClass, removeClass } from '../utils/class';
import { forceReflow } from '../utils/transition';
import ScrollLocker from '../utils/ScrollLocker';
import { contains } from '../utils/dom';
import { useTheme } from '../ThemeProvider';

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  getContainer?: PortalContainerType;
  children: React.ReactNode;
  defaultVisible?: boolean;
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  unmountOnHide?: boolean;
  mountOnShow?: boolean;
  escClosable?: boolean;
  mask?: boolean;
  maskClosable?: boolean;
  wrapperClassName?: string;
  onAfterClosed?: () => void;
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
if (env.isBrowser) {
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
    unmountOnHide,
    mountOnShow = true,
    mask = true,
    maskClosable = true,
    escClosable = true,
    className,
    wrapperClassName,
    onAfterClosed,
    ...others
  } = props;

  const { clsPrefix } = useTheme();

  const [visible, setVisible] = usePropChange(defaultVisible, visibleProp, onVisibleChange);

  const [animatedVisible, setAnimatedVisible] = React.useState(visible);

  const [zIndex, setZIndex] = React.useState<number>();

  const bodyRef = React.useRef<HTMLDivElement>(null);
  const isFirstMountRef = React.useRef(true);

  const containerRef = React.useRef<HTMLDivElement>(null);

  const forkRef = useForkRef(containerRef, ref);

  const innerFocusRef = React.useRef(false);

  const isTop = React.useCallback(() => {
    return modalManagers[modalManagers.length - 1] === bodyRef.current;
  }, []);

  const inProp = visible && animatedVisible;

  const transitionCount = React.useRef(inProp ? (mask ? 2 : 1) : 0);

  React.useEffect(() => {
    const body = bodyRef.current;
    const container = containerRef.current;

    if (!inProp || !body || !container) {
      return;
    }
    modalManagers.push(body);

    let activeElement: HTMLElement;
    if (!contains(container, document.activeElement)) {
      activeElement = document.activeElement as HTMLElement;
    }

    const handleFocusIn = (e: FocusEvent) => {
      if (innerFocusRef.current) {
        innerFocusRef.current = false;
        return;
      }
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
      modalManagers = modalManagers.filter((it) => it !== body);
      document.removeEventListener('focusin', handleFocusIn, true);
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
  }, [inProp, isTop]);

  React.useEffect(() => {
    if (!visible) {
      return;
    }
    setAnimatedVisible(true);
    setZIndex(increaseZindex());
    scrollLocker.lock();
    return () => {
      scrollLocker.unlock();
    };
  }, [visible]);

  const rootClassName = `${clsPrefix}-modal`;

  const beforeEnter = React.useCallback((el: HTMLElement) => {
    el.style.display = '';
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

  const afterLeave = React.useCallback(
    (el: HTMLElement) => {
      transitionCount.current--;
      if (transitionCount.current <= 0) {
        transitionCount.current = 0;
        setAnimatedVisible(false);
        onAfterClosed?.();
      }
      el.style.display = 'none';
    },
    [setAnimatedVisible, onAfterClosed],
  );

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

  const handleInnerFocus = React.useCallback(() => {
    innerFocusRef.current = true;
  }, []);

  const hidden = !visible && !animatedVisible;

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
    <Portal getContainer={getContainer}>
      <ModalRoot
        onFocus={handleInnerFocus}
        aria-hidden={!visible}
        className={clsx(rootClassName, wrapperClassName)}
        ref={forkRef}
        style={{ zIndex, display: hidden ? 'none' : '' }}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
      >
        {mask && (
          <CssTransition
            transitionClasses={`${rootClassName}__mask`}
            in={inProp}
            mountOnEnter={true}
            beforeEnter={beforeEnter}
            afterLeave={afterLeave}
          >
            <ModalMask
              aria-hidden={true}
              className={`${rootClassName}__mask`}
              onClick={handleMaskClick}
            />
          </CssTransition>
        )}
        <CssTransition
          transitionClasses={bodyClassName}
          in={inProp}
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
        </CssTransition>
      </ModalRoot>
    </Portal>
  );
});

if (!env.isProduction) {
  Modal.displayName = displayName;
  Modal.propTypes = {
    getContainer: PropTypes.any,
    children: PropTypes.node.isRequired,
    defaultVisible: PropTypes.bool,
    visible: PropTypes.bool,
    onVisibleChange: PropTypes.func,
    unmountOnHide: PropTypes.bool,
    mountOnShow: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
    mask: PropTypes.bool,
    maskClosable: PropTypes.bool,
    escClosable: PropTypes.bool,
    wrapperClassName: PropTypes.string,
    onAfterClosed: PropTypes.func,
  };
}

export default Modal;