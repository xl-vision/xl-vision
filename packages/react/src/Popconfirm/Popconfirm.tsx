import { useConstantFn } from '@xl-vision/hooks';
import { ExclamationCircleOutlined } from '@xl-vision/icons';
import { isProduction, isServer } from '@xl-vision/utils';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { ReactNode, forwardRef, useState } from 'react';
import Button, { ButtonProps } from '../Button';
import { useConfig } from '../ConfigProvider';
import usePropChange from '../hooks/usePropChange';
import Popper, { PopperProps, PopperTrigger } from '../Popper';
import { styled } from '../styles';
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
  onCancel?: () => void | Promise<any>;
  onConfirm?: () => void | Promise<any>;
};

const displayName = 'Popconfirm';

const PopconfirmRoot = styled(Popper, {
  name: displayName,
  slot: 'Root',
})(({ theme }) => {
  const { clsPrefix, transition } = theme;

  return {
    [`.${clsPrefix}-popconfirm`]: {
      ...transition.fadeIn('&'),
      ...transition.fadeOut('&'),
    },
  };
});

const PopconfirmArrow = styled('div', {
  name: displayName,
  slot: 'Arrow',
})(({ theme }) => {
  const { color } = theme;
  const bgColor = color.background.paper;

  return {
    width: 8,
    height: 8,
    backgroundColor: bgColor,
    transform: 'translate(-4px, -4px) rotate(45deg)',
  };
});

const PopconfirmPopup = styled('div', {
  name: displayName,
  slot: 'Popup',
})(({ theme }) => {
  const { color, typography, elevations, clsPrefix, styleSize } = theme;
  const bgColor = color.background.paper;

  return {
    backgroundColor: bgColor,
    color: color.getContrastColor(bgColor).text.primary,
    borderRadius: styleSize.middle.borderRadius,
    padding: '12px 16px',
    ...elevations(8),
    [`.${clsPrefix}-popconfirm__content`]: {
      position: 'relative',
      padding: '4px 0px 12px',
      minWidth: 110,
      ...typography.body1.style,
    },
    [`.${clsPrefix}-popconfirm__icon`]: {
      position: 'absolute',
      top: typography.pxToRem(6),
      left: 0,
      color: color.themes.warning.color,
    },
    [`.${clsPrefix}-popconfirm__title`]: {
      paddingLeft: 22,
    },
    [`.${clsPrefix}-popconfirm__footer`]: {
      textAlign: 'right',
      button: {
        marginLeft: 8,
      },
    },
  };
});

const defaultIcon = <ExclamationCircleOutlined />;

const Popconfirm = forwardRef<HTMLDivElement, PopconfirmProps>((props, ref) => {
  const { clsPrefix } = useTheme();
  const { locale } = useConfig();

  const {
    popupContainer,
    className,
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

  const [open, setOpen] = usePropChange(defaultOpen, openProp, onOpenChange);

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
      });
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
      });
  });

  const handleVisibleChange = useConstantFn((value: boolean) => {
    if (confirmLoading || cancelLoading) {
      return;
    }
    setOpen(value);
  });

  const rootClassName = `${clsPrefix}-popconfirm`;

  const popup = (
    <PopconfirmPopup className={clsx(`${rootClassName}__popup`)}>
      <div className={`${rootClassName}__content`}>
        <span className={`${rootClassName}__icon`}>{icon}</span>
        <span className={`${rootClassName}__title`}>{title}</span>
      </div>
      <div className={`${rootClassName}__footer`}>
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
          disableElevation={true}
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
      </div>
    </PopconfirmPopup>
  );

  const arrow = <PopconfirmArrow className={`${rootClassName}__arrow`} />;

  const rootClasses = clsx(rootClassName, className);

  return (
    <PopconfirmRoot
      role='tooltip'
      {...others}
      arrow={!hideArrow && arrow}
      className={rootClasses}
      offset={offset}
      open={open}
      popup={popup}
      popupContainer={popupContainer}
      ref={ref}
      transitionClassName={transitionClassName || rootClassName}
      trigger={trigger}
      onOpenChange={handleVisibleChange}
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
