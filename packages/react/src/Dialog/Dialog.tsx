import clsx from 'clsx';
import PropTypes from 'prop-types';
import { isProduction, noop } from '@xl-vision/utils';
import { useConstantFn } from '@xl-vision/hooks';
import { ReactNode, forwardRef, useState, useContext, useEffect } from 'react';
import Modal, { ModalProps } from '../Modal';
import ThemeContext from '../ThemeProvider/ThemeContext';
import { styled } from '../styles';
import Button, { ButtonProps } from '../Button';
import usePropChange from '../hooks/usePropChange';
import { useConfig } from '../ConfigProvider';

export type DialogButtonProps = Omit<ButtonProps, 'children' | 'onClick'>;

export interface DialogProps extends Omit<ModalProps, 'bodyProps' | 'title' | 'children'> {
  title: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  prompt?: boolean;
  confirmButtonProps?: DialogButtonProps;
  cancelButtonProps?: DialogButtonProps;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
}

const displayName = 'Dialog';

const DialogRoot = styled(Modal, {
  name: displayName,
  slot: 'Root',
})(({ theme }) => {
  const { color, elevations, styleSize } = theme;
  return {
    backgroundColor: color.background.paper,
    borderRadius: styleSize.middle.borderRadius,
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
    color: color.text.primary,
    padding: '16px 24px',
    [`.${clsPrefix}-dialog__title`]: {
      ...typography.h6.style,
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
})(() => {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'wrap-reverse',
  };
});

let uuid = 0;

const Dialog = forwardRef<HTMLDivElement, DialogProps>((props, ref) => {
  const { locale } = useConfig();

  const {
    children,
    title,
    footer,
    prompt,
    className,
    visible: visibleProp,
    onVisibleChange: onVisibleChangeProp,
    defaultVisible: defaultVisibleProp = false,
    onConfirm,
    onCancel,
    cancelText = locale.Dialog.cancelText,
    confirmText = locale.Dialog.confirmText,
    cancelButtonProps,
    confirmButtonProps,
    ...others
  } = props;

  const [visible, setVisible] = usePropChange(defaultVisibleProp, visibleProp, onVisibleChangeProp);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const { clsPrefix } = useContext(ThemeContext);

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
        setVisible(false);
      })
      .finally(() => {
        setConfirmLoading(false);
      });
  });

  const handleCancel = useConstantFn(() => {
    new Promise((resolve) => {
      setCancelLoading(true);
      resolve(onCancel?.());
    })
      .then(() => {
        setVisible(false);
      })
      .finally(() => {
        setCancelLoading(false);
      });
  });

  const handleVisibleChange = useConstantFn((_visible: boolean) => {
    // 在loading时，必须等待结果，而不能直接关闭
    if (confirmLoading || cancelLoading) {
      return;
    }
    setVisible(_visible);
    if (!_visible) {
      onCancel?.()?.catch(noop);
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
        variant='text'
        {...(confirmButtonProps as ButtonProps)}
        disabled={cancelLoading}
        loading={confirmLoading}
        onClick={handleConfirm}
      >
        {confirmText}
      </Button>
    </DialogActions>
  );

  const rootClassName = `${clsPrefix}-dialog`;

  return (
    <DialogRoot
      aria-labelledby={dialogTitleId}
      ref={ref}
      {...others}
      className={clsx(rootClassName, className)}
      visible={visible}
      onVisibleChange={handleVisibleChange}
    >
      <DialogHeader className={`${rootClassName}__header`} id={dialogTitleId}>
        {typeof title === 'string' ? <h6 className={`${rootClassName}__title`}>{title}</h6> : title}
      </DialogHeader>
      {children && (
        <DialogContent className={`${rootClassName}__content`}>{children}</DialogContent>
      )}
      {footer !== null && (
        <DialogFooter className={`${rootClassName}__footer`}>
          {footer || defaultFooterNode}
        </DialogFooter>
      )}
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
    defaultVisible: PropTypes.bool,
    footer: PropTypes.node,
    prompt: PropTypes.bool,
    visible: PropTypes.bool,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
    onVisibleChange: PropTypes.func,
  };
}

export default Dialog;
