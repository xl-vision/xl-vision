import React from 'react';
import clsx from 'clsx';
import { isDevelopment } from '../utils/env';
import Modal, { ModalProps } from '../Modal';
import ThemeContext from '../ThemeProvider/ThemeContext';
import { styled } from '../styles';
import Button from '../Button';
import usePropChange from '../hooks/usePropChange';
import useEventCallback from '../hooks/useEventCallback';

export interface DialogProps extends Omit<ModalProps, 'bodyProps' | 'title'> {
  title?: React.ReactNode;
  footer?: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
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
    maxWidth: 560,
    margin: 32,
    maxHeight: 'calc(100% - 64px)',
    display: 'flex',
    flexDirection: 'column',
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
    flex: 1,
    color: color.text.secondary,
    ...typography.body1,
  };
});

const DialogFooter = styled('div', {
  name: displayName,
  slot: 'Footer',
})(() => {
  return {
    padding: 8,
    textAlign: 'right',
  };
});

let uuid = 0;

const Dialog = React.forwardRef<HTMLDivElement, DialogProps>((props, ref) => {
  const {
    children,
    title,
    footer,
    className,
    visible: visibleProp,
    onVisibleChange: onVisibleChangeProp,
    defaultVisible: defaultVisibleProp = false,
    onConfirm,
    onCancel,
    ...others
  } = props;

  const [visible, setVisible] = usePropChange(defaultVisibleProp, visibleProp, onVisibleChangeProp);

  const { clsPrefix } = React.useContext(ThemeContext);

  const [dialogTitleId, setDialogTitleId] = React.useState('');

  React.useEffect(() => {
    setDialogTitleId(`${clsPrefix}DialogTitle${uuid}`);
    uuid++;
  }, [clsPrefix]);

  const handleConfirm = useEventCallback(() => {
    onConfirm?.();
    setVisible(false);
  });

  const handleCancel = useEventCallback(() => {
    onCancel?.();
    setVisible(false);
  });

  const defaultFooterNode = (
    <div>
      <Button theme='primary' variant='text' onClick={handleConfirm}>
        确认
      </Button>
      <Button theme='primary' variant='text' onClick={handleCancel}>
        取消
      </Button>
    </div>
  );

  const rootClassName = `${clsPrefix}-dialog`;

  return (
    <DialogRoot
      ref={ref}
      aria-labelledby={dialogTitleId}
      {...others}
      className={clsx(rootClassName, className)}
      // eslint-disable-next-line react/jsx-handler-names
      onVisibleChange={setVisible}
      visible={visible}
    >
      {title != null && (
        <DialogHeader id={dialogTitleId} className={`${rootClassName}__header`}>
          {typeof title === 'string' ? (
            <h6 className={`${rootClassName}__title`}>{title}</h6>
          ) : (
            title
          )}
        </DialogHeader>
      )}
      <DialogContent className={`${rootClassName}__content`}>{children}</DialogContent>
      {footer !== null && (
        <DialogFooter className={`${rootClassName}__footer`}>
          {footer || defaultFooterNode}
        </DialogFooter>
      )}
    </DialogRoot>
  );
});

if (isDevelopment) {
  Dialog.displayName = displayName;
  Dialog.propTypes = {};
}

export default Dialog;
