import React from 'react';
import clsx from 'clsx';
import { isDevelopment } from '../utils/env';
import Modal, { ModalProps } from '../Modal';
import ThemeContext from '../ThemeProvider/ThemeContext';
import { styled } from '../styles';
import Button from '../Button';

export interface DialogProps extends Omit<ModalProps, 'bodyProps' | 'title'> {
  title: React.ReactNode;
  footer?: React.ReactNode;
}

const displayName = 'Dialog';

const DialogRoot = styled(Modal, {
  name: displayName,
  slot: 'Root',
})(({ theme }) => {
  const { color, elevations } = theme;
  return {
    backgroundColor: color.background.paper,
    borderRadius: 8,
    ...elevations(24),
  };
});

const DialogHeader = styled('div', {
  name: displayName,
  slot: 'Header',
})(({ theme }) => {
  const { clsPrefix, typography, color } = theme;
  return {
    padding: '16px 24px',
    color: color.text.primary,
    [`.${clsPrefix}-dialog__title`]: {
      ...typography.h6,
      margin: 0,
    },
  };
});

const DialogContent = styled('div', {
  name: displayName,
  slot: 'Content',
})(({ theme }) => {
  const { typography, color } = theme;

  return {
    padding: '8px 24px',
    overflowY: 'auto',
    color: color.text.secondary,
    ...typography.body1,
  };
});

const DialogFooter = styled('div', {
  name: displayName,
  slot: 'Footer',
})(() => {
  return {};
});

let uuid = 0;

const Dialog = React.forwardRef<HTMLDivElement, DialogProps>((props, ref) => {
  const { children, title, footer, className, ...others } = props;

  const { clsPrefix } = React.useContext(ThemeContext);

  const [dialogTitleId, setDialogTitleId] = React.useState('');

  React.useEffect(() => {
    setDialogTitleId(`${clsPrefix}DialogTitle${uuid}`);
    uuid++;
  }, [clsPrefix]);

  const defaultFooterNode = (
    <div>
      <Button theme='primary' variant='text'>
        确认
      </Button>
      <Button theme='primary' variant='text'>
        取消
      </Button>
    </div>
  );

  const rootClassName = `${clsPrefix}-dialog`;

  return (
    <DialogRoot
      ref={ref}
      {...others}
      className={clsx(rootClassName, className)}
      aria-labelledby={dialogTitleId}
    >
      <DialogHeader id={dialogTitleId} className={`${rootClassName}__header`}>
        <h6 className={`${rootClassName}__title`}>{title}</h6>
      </DialogHeader>
      <DialogContent className={`${rootClassName}__content`}>{children}</DialogContent>
      <DialogFooter className={`${rootClassName}__footer`}>
        {footer || defaultFooterNode}
      </DialogFooter>
    </DialogRoot>
  );
});

if (isDevelopment) {
  Dialog.displayName = displayName;
  Dialog.propTypes = {};
}

export default Dialog;
