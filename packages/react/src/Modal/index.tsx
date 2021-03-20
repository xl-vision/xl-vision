import React from 'react';
import { isDevelopment } from '../utils/env';

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {}

const displayName = 'Modal';

const Modal = React.forwardRef<HTMLDivElement, ModalProps>((props, ref) => {
  const { children, ...others } = props;

  return (
    <div {...others} ref={ref}>
      {children}
    </div>
  );
});

if (isDevelopment) {
  Modal.displayName = displayName;
  Modal.propTypes = {};
}

export default Modal;
