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
  const { clsPrefix } = theme;

  return {
    position: 'fixed',
    inset: 0,
    [`.${clsPrefix}-modal__mask`]: {
      position: 'fixed',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    [`.${clsPrefix}-modal__wrap`]: {
      position: 'fixed',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    [`.${clsPrefix}-modal__body`]: {
      position: 'relative',
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
    mountOnOpen,
    className,
    style,
    ...others
  } = props;

  const { clsPrefix } = React.useContext(ThemeContext);

  const [visible, setVisible] = usePropChange(defaultVisible, visibleProp, onVisibleChange);

  const [zIndex, setZIndex] = React.useState<number>();

  const isFirstMountRef = React.useRef(true);

  const bodyRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (visible) {
      setZIndex(increaseZindex());
    }
  }, [visible]);

  const maskBeforeEnter = useEventCallback((el: HTMLElement) => {
    el.style.display = '';
  });

  const modalBeforeEnter = useEventCallback((el: HTMLElement) => {
    if (mousePosition && bodyRef.current) {
      bodyRef.current.style.transformOrigin = `${mousePosition.x}px ${mousePosition.y}px`;
    }
    el.style.display = '';
  });

  const afterLeave = useEventCallback((el: HTMLElement) => {
    el.style.display = 'none';
  });

  const handleMaskClick = useEventCallback(() => {
    setVisible(false);
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
          in={visible}
          afterLeave={afterLeave}
          beforeEnter={maskBeforeEnter}
        >
          <div aria-hidden={true} className={`${rootClassName}__mask`} />
        </CSSTransition>
        <div className={`${rootClassName}__wrap`} onClick={handleMaskClick}>
          <CSSTransition
            transitionClasses={`${rootClassName}__body`}
            in={visible}
            afterLeave={afterLeave}
            beforeEnter={modalBeforeEnter}
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
