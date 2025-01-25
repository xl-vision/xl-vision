import { useConstantFn, useValueChange } from '@xl-vision/hooks';
import { isProduction } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { ReactNode, forwardRef, useState, useEffect } from 'react';
import Button, { ButtonProps } from '../Button';
import Modal, { ModalInstance, ModalProps } from '../Modal';
import { styled } from '../styles';
import { useTheme } from '../ThemeProvider';

export type DialogButtonProps = Omit<ButtonProps, 'children' | 'onClick'>;

export interface DialogProps extends Omit<ModalProps, 'bodyProps' | 'title' | 'children'> {
  title: ReactNode;
  cancelButtonProps?: DialogButtonProps;
  cancelText?: string;
  children?: ReactNode;
  confirmButtonProps?: DialogButtonProps;
  confirmText?: string;
  footer?: ReactNode;
  onCancel?: () => void | Promise<void>;
  onConfirm?: () => void | Promise<void>;
  prompt?: boolean;
}

export type DialogInstance = ModalInstance;

const displayName = 'Dialog';

const DialogRoot = styled(Modal, {
  name: displayName,
  slot: 'Root',
})(({ theme }) => {
  const { colors, elevations, sizes } = theme;
  return {
    backgroundColor: colors.background.popper,
    borderRadius: sizes.middle.borderRadius,
    maxWidth: 560,
    margin: 32,
    maxHeight: 'calc(100% - 64px)',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: elevations[3],
  };
});

const DialogHeader = styled('div', {
  name: displayName,
  slot: 'Header',
})(({ theme }) => {
  const { colors } = theme;
  return {
    color: colors.text.primary,
    padding: '16px 24px',
  };
});

const DialogTitle = styled('h6', {
  name: displayName,
  slot: 'Title',
})(({ theme: { typography } }) => {
  return {
    ...typography.h6.style,
    margin: 0,
  };
});

const DialogContent = styled('div', {
  name: displayName,
  slot: 'Content',
})(({ theme }) => {
  const { typography, colors } = theme;

  return {
    padding: '8px 24px',
    overflowY: 'auto',
    flex: 1,
    color: colors.text.secondary,
    ...typography.body1.style,
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

const DialogActions = styled('div', {
  name: displayName,
  slot: 'Actions',
})(({ theme: { size } }) => {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'wrap-reverse',
    button: {
      marginLeft: size.padding.x,
    },
  };
});

let uuid = 0;

const Dialog = forwardRef<DialogInstance, DialogProps>((props, ref) => {
  const { clsPrefix, locale } = useTheme();

  const {
    children,
    title,
    footer,
    prompt,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    onConfirm,
    onCancel,
    cancelText = locale.Dialog.cancelText,
    confirmText = locale.Dialog.confirmText,
    cancelButtonProps,
    confirmButtonProps,
    ...others
  } = props;

  const [open, setOpen] = useValueChange(defaultOpen, openProp, onOpenChange);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const [dialogTitleId, setDialogTitleId] = useState('');

  useEffect(() => {
    setDialogTitleId(`${clsPrefix}DialogTitle${uuid}`);
    uuid++;
  }, [clsPrefix]);

  const handleConfirm = useConstantFn(() => {
    new Promise((resolve) => {
      setConfirmLoading(true);
      resolve(onConfirm?.());
    })
      .then(() => {
        setOpen(false);
      })
      .finally(() => {
        setConfirmLoading(false);
      })
      .catch(console.error);
  });

  const handleCancel = useConstantFn(() => {
    new Promise((resolve) => {
      setCancelLoading(true);
      resolve(onCancel?.());
    })
      .then(() => {
        setOpen(false);
      })
      .finally(() => {
        setCancelLoading(false);
      })
      .catch(console.error);
  });

  const handleOpenChange = useConstantFn((v: boolean) => {
    // 在loading时，必须等待结果，而不能直接关闭
    if (confirmLoading || cancelLoading) {
      return;
    }
    setOpen(v);
    if (!v) {
      onCancel?.()?.catch(console.error);
    }
  });

  const defaultFooterNode = (
    <DialogActions>
      {!prompt && (
        <Button
          color='primary'
          variant='text'
          {...(cancelButtonProps as ButtonProps)}
          disabled={confirmLoading}
          loading={cancelLoading}
          onClick={handleCancel}
        >
          {cancelText}
        </Button>
      )}
      <Button
        color='primary'
        {...(confirmButtonProps as ButtonProps)}
        disabled={cancelLoading}
        loading={confirmLoading}
        onClick={handleConfirm}
      >
        {confirmText}
      </Button>
    </DialogActions>
  );

  return (
    <DialogRoot
      aria-labelledby={dialogTitleId}
      ref={ref}
      {...others}
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogHeader id={dialogTitleId}>
        {typeof title === 'string' ? <DialogTitle>{title}</DialogTitle> : title}
      </DialogHeader>
      {children && <DialogContent>{children}</DialogContent>}
      {footer !== null && <DialogFooter>{footer || defaultFooterNode}</DialogFooter>}
    </DialogRoot>
  );
});

if (!isProduction) {
  Dialog.displayName = displayName;
  Dialog.propTypes = {
    title: PropTypes.node.isRequired,
    cancelButtonProps: PropTypes.shape({}),
    cancelText: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    confirmButtonProps: PropTypes.shape({}),
    confirmText: PropTypes.string,
    defaultOpen: PropTypes.bool,
    footer: PropTypes.node,
    open: PropTypes.bool,
    prompt: PropTypes.bool,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
    onOpenChange: PropTypes.func,
  };
}

export default Dialog;
