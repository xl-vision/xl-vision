import React from 'react';
import { isDevelopment } from '../utils/env';
import Modal, { ModalProps } from '../Modal';
import ThemeContext from '../ThemeProvider/ThemeContext';

export interface DialogProps extends Omit<ModalProps, 'bodyProps' | 'title'> {
  title: React.ReactNode;
  footer?: React.ReactNode;
}

const displayName = 'Dialog';

let uuid = 0;

const Dialog = React.forwardRef<HTMLDivElement, DialogProps>((props, ref) => {
  const { children, title, footer, ...others } = props;

  const { clsPrefix } = React.useContext(ThemeContext);

  const [dialogTitleId, setDialogTitleId] = React.useState('');

  React.useEffect(() => {
    setDialogTitleId(`${clsPrefix}DialogTitle${uuid}`);
    uuid++;
  }, [clsPrefix]);

  const defaultFooterNode = <div></div>;

  return (
    <Modal ref={ref} {...others} aria-labelledby={dialogTitleId}>
      <div>
        <div id={dialogTitleId}>{title}</div>
        <div>{children}</div>
        <div>{footer || defaultFooterNode}</div>
      </div>
    </Modal>
  );
});

if (isDevelopment) {
  Dialog.displayName = displayName;
  Dialog.propTypes = {};
}

export default Dialog;
