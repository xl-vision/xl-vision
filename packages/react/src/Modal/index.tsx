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
import useEventCallback from '../hooks/useEventCallback';
import { addClass, removeClass } from '../utils/class';
import { forceReflow } from '../utils/transition';
import ScrollLocker from '../utils/ScrollLocker';

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  getContainer?: PortalContainerType;
  children: React.ReactNode;
  defaultVisible?: boolean;
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  destroyOnClose?: boolean;
  mountOnOpen?: boolean;
}

const displayName = 'Modal';

const ModalRoot = styled('div')(({ theme }) => {
  const { clsPrefix, transition } = theme;

  return {
    position: 'fixed',
    inset: 0,
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    [`.${clsPrefix}-modal__mask`]: {
      position: 'absolute',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
      backgroundColor: 'rgba(0,0,0,0.5)',
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
    [`.${clsPrefix}-modal__wrap`]: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    [`.${clsPrefix}-modal__body`]: {
      position: 'relative',

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
  mousePosition = {
    x: e.pageX,
    y: e.pageY,
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
    className,
    style,
    ...others
  } = props;

  const { clsPrefix } = React.useContext(ThemeContext);

  const [visible, setVisible] = usePropChange(defaultVisible, visibleProp, onVisibleChange);

  const [animatedVisible, setAnimatedVisible] = React.useState(visible);

  const [zIndex, setZIndex] = React.useState<number>();

  const isFirstMountRef = React.useRef(true);

  const transitionCount = React.useRef(0);

  const bodyRef = React.useRef<HTMLDivElement>(null);

  const isTop = useEventCallback(() => {
    return modalManagers[modalManagers.length - 1] === bodyRef.current;
  });

  React.useEffect(() => {
    const el = bodyRef.current;

    if (!animatedVisible || !el) {
      return;
    }
    modalManagers.push(el);
    el.focus();
    return () => {
      modalManagers = modalManagers.filter((it) => it !== el);
      if (modalManagers.length) {
        modalManagers[modalManagers.length - 1].focus();
      }
    };
  }, [animatedVisible]);

  React.useEffect(() => {
    setAnimatedVisible(visible);
    if (visible) {
      setZIndex(increaseZindex());
      scrollLocker.lock();
      return () => {
        scrollLocker.unlock();
      };
    }
  }, [visible]);

  const modalBeforeEnter = useEventCallback((el: HTMLElement) => {
    if (mousePosition) {
      removeClass(el, `${bodyTransitionClasses}-enter-from`);
      removeClass(el, `${bodyTransitionClasses}-enter-active`);
      const { x, y } = el.getBoundingClientRect();
      el.style.transformOrigin = `${mousePosition.x - x}px ${mousePosition.y - y}px`;
      addClass(el, `${bodyTransitionClasses}-enter-from`);
      forceReflow();
      addClass(el, `${bodyTransitionClasses}-enter-active`);
    }
  });

  const afterLeave = useEventCallback(() => {
    transitionCount.current++;
    if (transitionCount.current === 2) {
      transitionCount.current = 0;
      setVisible(false);
    }
  });

  const handleMaskClick = useEventCallback(() => {
    setAnimatedVisible(false);
  });

  const handleKeyDown = useEventCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isTop()) {
      setAnimatedVisible(false);
    }
  });

  if (visible) {
    isFirstMountRef.current = false;
  }

  if (isFirstMountRef.current) {
    if (mountOnOpen && !visible) {
      return null;
    }
  } else if (destroyOnClose && !visible) {
    return null;
  }

  const rootClassName = `${clsPrefix}-modal`;

  const rootClasses = clsx(rootClassName, className);

  const bodyTransitionClasses = `${rootClassName}__body`;

  return (
    <Portal getContainer={getContainer}>
      <ModalRoot
        aria-hidden={!visible}
        {...others}
        className={rootClasses}
        ref={ref}
        style={{ ...style, zIndex, display: visible ? '' : 'none' }}
        onKeyDown={handleKeyDown}
      >
        <CSSTransition
          transitionClasses={`${rootClassName}__mask`}
          in={animatedVisible}
          mountOnEnter={true}
          afterLeave={afterLeave}
        >
          <div aria-hidden={true} className={`${rootClassName}__mask`} />
        </CSSTransition>
        <div className={`${rootClassName}__wrap`} onClick={handleMaskClick}>
          <div tabIndex={0} onFocus={() => bodyRef.current?.focus()} />
          <CSSTransition
            transitionClasses={bodyTransitionClasses}
            in={animatedVisible}
            mountOnEnter={true}
            beforeEnter={modalBeforeEnter}
            afterLeave={afterLeave}
          >
            <div
              tabIndex={-1}
              className={`${rootClassName}__body`}
              onClick={(e) => e.stopPropagation()}
              ref={bodyRef}
            >
              {children}
            </div>
          </CSSTransition>
          <div tabIndex={0} onFocus={() => bodyRef.current?.focus()} />
        </div>
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
  };
}

export default Modal;
