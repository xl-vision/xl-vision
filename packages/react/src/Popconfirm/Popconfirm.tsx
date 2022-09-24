import clsx from 'clsx';
import PropTypes from 'prop-types';
import { ExclamationCircleOutlined } from '@xl-vision/icons';
import { isProduction, isServer } from '@xl-vision/utils';
import { useConstantFn } from '@xl-vision/hooks';
import { ReactNode, forwardRef, useState } from 'react';
import Popper, { PopperProps, PopperTrigger } from '../Popper';
import { styled } from '../styles';
import Button, { ButtonProps } from '../Button';
import usePropChange from '../hooks/usePropChange';
import { useTheme } from '../ThemeProvider';
import { useConfig } from '../ConfigProvider';

export type PopconfirmButtonProps = Omit<ButtonProps, 'children' | 'onClick'>;
export type PopconfirmProps = Omit<PopperProps, 'popup' | 'arrow' | 'title'> & {
  title: ReactNode;
  icon?: ReactNode;
  onConfirm?: () => void | Promise<any>;
  onCancel?: () => void | Promise<any>;
  confirmButtonProps?: PopconfirmButtonProps;
  cancelButtonProps?: PopconfirmButtonProps;
  confirmText?: string;
  cancelText?: string;
  hideArrow?: boolean;
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
    visible: visibleProp,
    onVisibleChange,
    onCancel,
    onConfirm,
    defaultVisible = false,
    cancelButtonProps,
    confirmButtonProps,
    cancelText = locale.Popconfirm.cancelText,
    confirmText = locale.Popconfirm.confirmText,
    hideArrow,
    transitionClassName,
    ...others
  } = props;

  const [visible, setVisible] = usePropChange(defaultVisible, visibleProp, onVisibleChange);

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

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

  const handleVisibleChange = useConstantFn((value: boolean) => {
    if (confirmLoading || cancelLoading) {
      return;
    }
    setVisible(value);
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
          style={{ minWidth: 0 }}
          size='small'
          color='primary'
          variant='text'
          {...(cancelButtonProps as ButtonProps)}
          loading={cancelLoading}
          disabled={confirmLoading}
          onClick={handleCancel}
        >
          {cancelText}
        </Button>
        <Button
          style={{ minWidth: 0 }}
          size='small'
          color='primary'
          variant='text'
          disableElevation={true}
          {...(confirmButtonProps as ButtonProps)}
          loading={confirmLoading}
          disabled={cancelLoading}
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
      visible={visible}
      // eslint-disable-next-line react/jsx-handler-names
      onVisibleChange={handleVisibleChange}
      ref={ref}
      trigger={trigger}
      className={rootClasses}
      offset={offset}
      arrow={!hideArrow && arrow}
      popup={popup}
      popupContainer={popupContainer}
      transitionClassName={transitionClassName || rootClassName}
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
    popupContainer: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
      isServer ? PropTypes.any : PropTypes.instanceOf(Element),
    ]),
    onVisibleChange: PropTypes.func,
    visible: PropTypes.bool,
    title: PropTypes.node,
    className: PropTypes.string,
    offset: PropTypes.number,
    trigger: PropTypes.oneOfType([triggerPropType, PropTypes.arrayOf(triggerPropType)]),
    icon: PropTypes.node,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
    cancelButtonProps: PropTypes.object,
    confirmButtonProps: PropTypes.object,
    cancelText: PropTypes.string,
    confirmText: PropTypes.string,
    defaultVisible: PropTypes.bool,
    hideArrow: PropTypes.bool,
    transitionClassName: PropTypes.string,
  };
}

export default Popconfirm;
