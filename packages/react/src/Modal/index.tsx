import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Portal, { PortalContainerType } from '../Portal';
import { isDevelopment } from '../utils/env';
import usePropChange from '../hooks/usePropChange';
import CSSTransition, { CSSTransitionClasses } from '../CSSTransition';
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
  forceRender?: boolean;
  transitionClasses?: CSSTransitionClasses;
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

const defaultGetContainer = () => document.body;

const Modal = React.forwardRef<HTMLDivElement, ModalProps>((props, ref) => {
  const {
    getContainer = defaultGetContainer,
    children,
    defaultVisible = false,
    visible: visibleProp,
    onVisibleChange,
    destroyOnClose,
    forceRender,
    className,
    transitionClasses,
    style,
    ...others
  } = props;

  const { clsPrefix } = React.useContext(ThemeContext);

  const [visible, setVisible] = usePropChange(defaultVisible, visibleProp, onVisibleChange);

  const [zIndex, setZIndex] = React.useState<number>();

  React.useEffect(() => {
    if (visible) {
      setZIndex(increaseZindex());
    }
  }, [visible]);

  const beforeEnter = useEventCallback((el: HTMLElement) => {
    el.style.display = '';
  });

  const afterLeave = useEventCallback((el: HTMLElement) => {
    el.style.display = 'none';
  });

  const handleMaskClick = useEventCallback(() => {
    setVisible(false);
  });

  const rootClassName = `${clsPrefix}-modal`;

  const rootClasses = clsx(rootClassName, className);

  return (
    <Portal getContainer={getContainer}>
      <CSSTransition
        transitionClasses={transitionClasses}
        in={visible}
        mountOnEnter={!forceRender}
        unmountOnLeave={destroyOnClose}
        afterLeave={afterLeave}
        beforeEnter={beforeEnter}
      >
        <ModalRoot
          aria-hidden={!visible}
          {...others}
          className={rootClasses}
          ref={ref}
          style={{ ...style, zIndex }}
        >
          <div aria-hidden={true} className={`${rootClassName}__mask`} onClick={handleMaskClick} />
          <div className={`${rootClassName}__wrap`}>
            <div className={`${rootClassName}__body`}>{children}</div>
          </div>
        </ModalRoot>
      </CSSTransition>
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
