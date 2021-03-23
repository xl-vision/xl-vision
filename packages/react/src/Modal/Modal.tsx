import React from 'react';
import PropTypes from 'prop-types';
import Portal, { PortalContainerType } from '../Portal';
import { isDevelopment } from '../utils/env';
import usePropChange from '../hooks/usePropChange';

export interface ModalProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  getContainer?: PortalContainerType;
  children: React.ReactNode;
  title: React.ReactNode;
  defaultVisible?: boolean;
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
}

const displayName = 'Modal';

const defaultGetContainer = () => document.body;

const Modal = React.forwardRef<HTMLDivElement, ModalProps>((props, ref) => {
  const {
    getContainer = defaultGetContainer,
    title,
    children,
    defaultVisible = false,
    visible: visibleProp,
    onVisibleChange,
    ...others
  } = props;

  const [visible, setVisible] = usePropChange(defaultVisible, visibleProp, onVisibleChange);

  return (
    <Portal getContainer={getContainer}>
      <div {...others} ref={ref}>
        {title}
        {children}
      </div>
    </Portal>
  );
});

if (isDevelopment) {
  Modal.displayName = displayName;
  Modal.propTypes = {
    getContainer: PropTypes.any,
    title: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    defaultVisible: PropTypes.bool,
    visible: PropTypes.bool,
    onVisibleChange: PropTypes.func,
  };
}

export default Modal;
