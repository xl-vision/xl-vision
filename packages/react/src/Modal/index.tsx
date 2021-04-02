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
      width: '100%',
      height: '100%',
      zIndex: -1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      '&-enter-active': {
        transition: transition.enter('opacity'),
      },
      '&-leave-active': {
        transition: transition.leavePermanent('opacity'),
      },
      '&-enter,&-leave-to': {
        opacity: 0,
      },
      '&-leave,&-enter-to': {
        opacity: 1,
      },
    },
    [`.${clsPrefix}-modal__wrap`]: {
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    [`.${clsPrefix}-modal__body`]: {
      position: 'relative',

      '&-enter-active': {
        transition: transition.enter(['opacity', 'transition']),
      },
      '&-leave-active': {
        transition: transition.leavePermanent(['opacity', 'transition']),
      },
      '&-enter,&-leave-to': {
        opacity: 0,
      },
      '&-leave,&-enter-to': {
        opacity: 1,
      },
      '&-enter': {
        transform: 'scale(0.8)',
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

const defaultGetContainer = () => document.body;

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

  const bodyRef = React.useRef<HTMLDivElement>(null);

  const transitionCount = React.useRef(0);

  React.useEffect(() => {
    if (visible) {
      setZIndex(increaseZindex());
    }
    setAnimatedVisible(visible);
  }, [visible]);

  const modalBeforeEnter = useEventCallback((el: HTMLElement) => {
    if (mousePosition && bodyRef.current) {
      bodyRef.current.style.transformOrigin = `${mousePosition.x}px ${mousePosition.y}px`;
    }
    el.style.display = '';
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

  return (
    <Portal getContainer={getContainer}>
      <ModalRoot
        aria-hidden={!visible}
        {...others}
        className={rootClasses}
        ref={ref}
        style={{ ...style, zIndex, display: visible ? '' : 'none' }}
      >
        <CSSTransition
          transitionClasses={`${rootClassName}__mask`}
          in={animatedVisible}
          afterLeave={afterLeave}
        >
          <div aria-hidden={true} className={`${rootClassName}__mask`} />
        </CSSTransition>
        <div className={`${rootClassName}__wrap`} onClick={handleMaskClick}>
          <CSSTransition
            transitionClasses={`${rootClassName}__body`}
            in={animatedVisible}
            beforeEnter={modalBeforeEnter}
            afterLeave={afterLeave}
          >
            <div
              ref={bodyRef}
              className={`${rootClassName}__body`}
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </div>
          </CSSTransition>
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
