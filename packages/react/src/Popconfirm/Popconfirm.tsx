import { useConstantFn, useValueChange } from '@xl-vision/hooks';
import { ExclamationCircleOutlined } from '@xl-vision/icons';
import { isProduction, isServer } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { ReactNode, forwardRef, useState } from 'react';
import Button, { ButtonProps } from '../Button';
import memoStyled from '../memoStyled';
import Popper, { PopperInstance, PopperProps, PopperTrigger } from '../Popper';
import { useTheme } from '../ThemeProvider';

export type PopconfirmButtonProps = Omit<ButtonProps, 'children' | 'onClick'>;

export type PopconfirmProps = Omit<PopperProps, 'popup' | 'arrow' | 'title'> & {
  title: ReactNode;
  cancelButtonProps?: PopconfirmButtonProps;
  cancelText?: string;
  confirmButtonProps?: PopconfirmButtonProps;
  confirmText?: string;
  hideArrow?: boolean;
  icon?: ReactNode;
  onCancel?: () => void | Promise<void>;
  onConfirm?: () => void | Promise<void>;
};

export type PopconfirmInstance = PopperInstance;

const displayName = 'Popconfirm';

const PopconfirmRoot = memoStyled(Popper, {
  name: displayName,
  slot: 'Root',
})(({ theme }) => {
  const { clsPrefix, transitions } = theme;

  return {
    [`.${clsPrefix}-popconfirm__inner`]: {
      ...transitions.fadeIn('&'),
      ...transitions.fadeOut('&'),
    },
  };
});

const PopconfirmArrow = memoStyled('div', {
  name: displayName,
  slot: 'Arrow',
})(({ theme }) => {
  const { colors } = theme;

  return {
    width: 8,
    height: 8,
    backgroundColor: colors.background.popper,
    transform: 'translate(-4px, -4px) rotate(45deg)',
  };
});

const PopconfirmPopup = memoStyled('div', {
  name: displayName,
  slot: 'Popup',
})(({ theme: { colors, elevations, sizes } }) => {
  return {
    backgroundColor: colors.background.popper,
    color: colors.text.primary,
    borderRadius: sizes.small.borderRadius,
    padding: '12px 16px',
    boxShadow: elevations[3],
  };
});

const PopconfirmContent = memoStyled('div', {
  name: displayName,
  slot: 'Content',
})(({ theme: { typography } }) => {
  return {
    position: 'relative',
    padding: '4px 0px 12px',
    minWidth: 110,
    ...typography.body1.style,
  };
});

const PopconfirmIcon = memoStyled('span', {
  name: displayName,
  slot: 'Icon',
})(({ theme: { typography, colors } }) => {
  return {
    position: 'absolute',
    top: typography.pxToRem(6),
    left: 0,
    color: colors.themes.warning.foreground.default,
  };
});

const PopconfirmTitle = memoStyled('span', {
  name: displayName,
  slot: 'Title',
})(() => {
  return {
    paddingLeft: 22,
  };
});

const PopconfirmFooter = memoStyled('div', {
  name: displayName,
  slot: 'Footer',
})(({ theme: { sizes } }) => {
  return {
    textAlign: 'right',
    button: {
      marginLeft: sizes.small.padding.x,
    },
  };
});

const defaultIcon = <ExclamationCircleOutlined />;

const Popconfirm = forwardRef<PopconfirmInstance, PopconfirmProps>((props, ref) => {
  const { locale, clsPrefix } = useTheme();

  const {
    popupContainer,
    offset = 12,
    trigger = 'click',
    title,
    icon = defaultIcon,
    open: openProp,
    onOpenChange,
    onCancel,
    onConfirm,
    defaultOpen = false,
    cancelButtonProps,
    confirmButtonProps,
    cancelText = locale.Popconfirm.cancelText,
    confirmText = locale.Popconfirm.confirmText,
    hideArrow,
    transitionClassName,
    ...others
  } = props;

  const [open, setOpen] = useValueChange(defaultOpen, openProp, onOpenChange);

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

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

  const handleOpenChange = useConstantFn((value: boolean) => {
    if (confirmLoading || cancelLoading) {
      return;
    }
    setOpen(value);
  });

  const rootClassName = `${clsPrefix}-popconfirm`;

  const popup = (
    <PopconfirmPopup>
      <PopconfirmContent>
        <PopconfirmIcon>{icon}</PopconfirmIcon>
        <PopconfirmTitle>{title}</PopconfirmTitle>
      </PopconfirmContent>
      <PopconfirmFooter>
        <Button
          color='primary'
          size='small'
          style={{ minWidth: 0 }}
          variant='text'
          {...(cancelButtonProps as ButtonProps)}
          disabled={confirmLoading}
          loading={cancelLoading}
          onClick={handleCancel}
        >
          {cancelText}
        </Button>
        <Button
          color='primary'
          size='small'
          style={{ minWidth: 0 }}
          variant='text'
          {...(confirmButtonProps as ButtonProps)}
          disabled={cancelLoading}
          loading={confirmLoading}
          onClick={handleConfirm}
        >
          {confirmText}
        </Button>
      </PopconfirmFooter>
    </PopconfirmPopup>
  );

  const arrow = <PopconfirmArrow />;

  return (
    <PopconfirmRoot
      role='tooltip'
      {...others}
      arrow={!hideArrow && arrow}
      offset={offset}
      open={open}
      popup={popup}
      popupContainer={popupContainer}
      ref={ref}
      transitionClassName={transitionClassName || `${rootClassName}__inner`}
      trigger={trigger}
      onOpenChange={handleOpenChange}
    />
  );
});

if (!isProduction) {
  Popconfirm.displayName = displayName;

  const triggerPropType = PropTypes.oneOf<PopperTrigger>([
    'click',
    'contextMenu',
    'focus',
    'hover',
  ]).isRequired;

  Popconfirm.propTypes = {
    cancelButtonProps: PropTypes.shape({}),
    cancelText: PropTypes.string,
    className: PropTypes.string,
    confirmButtonProps: PropTypes.shape({}),
    confirmText: PropTypes.string,
    defaultOpen: PropTypes.bool,
    hideArrow: PropTypes.bool,
    icon: PropTypes.node,
    offset: PropTypes.number,
    open: PropTypes.bool,
    popupContainer: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
      isServer ? PropTypes.any : PropTypes.instanceOf(Element),
    ]),
    title: PropTypes.node,
    transitionClassName: PropTypes.string,
    trigger: PropTypes.oneOfType([triggerPropType, PropTypes.arrayOf(triggerPropType)]),
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
    onOpenChange: PropTypes.func,
  };
}

export default Popconfirm;
