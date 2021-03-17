import clsx from 'clsx';
import React from 'react';
import PropTypes from 'prop-types';
import ErrorFilled from '@xl-vision/icons/ErrorFilled';
import Popper, { PopperProps, PopperTrigger } from '../Popper';
import { styled } from '../styles';
import ThemeContext from '../ThemeProvider/ThemeContext';
import { isDevelopment } from '../utils/env';
import Button, { ButtonProps } from '../Button';
import LocalizationContext from '../LocalizationProvider/LocalizationContext';
import Icon from '../Icon';
import useEventCallback from '../hooks/useEventCallback';

export type PopconfirmButtonProps = Omit<ButtonProps, 'children' | 'onClick'>;
export interface PopconfirmProps
  extends Omit<PopperProps, 'popup' | 'arrow' | 'transitionClasses' | 'disablePopupEnter'> {
  title: React.ReactNode;
  icon?: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmButtonProps?: PopconfirmButtonProps;
  cancelButtonProps?: PopconfirmButtonProps;
  confirmText?: string;
  cancelText?: string;
}

const displayName = 'Popconfirm';

const PopconfirmRoot = styled(Popper, {
  name: displayName,
  slot: 'Root',
})(({ theme }) => {
  const { clsPrefix, transition } = theme;

  return {
    [`.${clsPrefix}-popconfirm-slide`]: {
      '&-enter-active, &-leave-active': {
        transition: transition.standard(['transform', 'opacity']),
        opacity: 1,
        transform: 'scale(1)',
      },
      '&-enter, &-leave-to': {
        opacity: 0,
        transform: 'scale(0.5)',
      },
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
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: bgColor,

    ':before': {
      position: 'absolute',
      content: '""',
      width: '8px',
      height: '8px',
      left: '-4px',
      top: '-4px',
      transform: 'rotate(45deg)',
      backgroundColor: 'inherit',
    },
    '&[data-placement^="left"]': {
      right: 0,
    },
    '&[data-placement^="right"]': {
      left: 0,
    },
    '&[data-placement^="top"]': {
      bottom: 0,
    },
    '&[data-placement^="bottom"]': {
      top: 0,
    },
  };
});

const PopconfirmPopup = styled('div', {
  name: displayName,
  slot: 'Popup',
})(({ theme }) => {
  const { color, typography, elevations, clsPrefix } = theme;
  const bgColor = color.background.paper;

  return {
    backgroundColor: bgColor,
    color: color.getContrastText(bgColor).text.primary,
    borderRadius: 4,
    padding: '12px 16px',
    ...elevations(16),
    [`.${clsPrefix}-popconfirm__content`]: {
      position: 'relative',
      padding: '4px 0px 12px',
      minWidth: 110,
      ...typography.body1,
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

const defaultIcon = (
  <Icon>
    <ErrorFilled />
  </Icon>
);

const defaultGetPopupContainer = () => document.body;

const Popconfirm = React.forwardRef<unknown, PopconfirmProps>((props, ref) => {
  const { clsPrefix } = React.useContext(ThemeContext);
  const { locale } = React.useContext(LocalizationContext);

  const {
    getPopupContainer = defaultGetPopupContainer,
    className,
    offset = 12,
    trigger = 'click',
    title,
    icon = defaultIcon,
    visible: visibleProp,
    onVisibleChange,
    onCancel,
    onConfirm,
    cancelButtonProps,
    confirmButtonProps,
    cancelText = locale.Popconfirm.cancelText,
    confirmText = locale.Popconfirm.confirmText,
    ...others
  } = props;

  const [visible, setVisible] = React.useState(visibleProp);

  React.useEffect(() => {
    if (visibleProp === undefined) {
      return;
    }
    setVisible(visibleProp);
  }, [visibleProp]);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const handleVisibleChange = useEventCallback((visible: boolean) => {
    if (visibleProp === undefined) {
      setVisible(visible);
    }
    onVisibleChange?.(visible);
  });

  const handleCancel = useEventCallback(() => {
    handleVisibleChange(false);
    onCancel?.();
  });

  const handleConfirm = useEventCallback(() => {
    handleVisibleChange(false);
    onConfirm?.();
  });

  const rootClassName = `${clsPrefix}-popconfirm`;

  const popup = (
    <PopconfirmPopup className={clsx(`${rootClassName}__popup`)}>
      <div className={`${rootClassName}__content`}>
        <span className={`${rootClassName}__icon`}>{icon}</span>
        <span className={`${rootClassName}__title`}>{title}</span>
      </div>
      <div className={`${rootClassName}__footer`}>
        {/** @ts-ignore */}
        <Button size='small' variant='outlined' {...cancelButtonProps} onClick={handleCancel}>
          {cancelText}
        </Button>
        {/** @ts-ignore */}
        <Button
          size='small'
          theme='primary'
          disableElevation={true}
          {...confirmButtonProps}
          onClick={handleConfirm}
        >
          {confirmText}
        </Button>
      </div>
    </PopconfirmPopup>
  );

  const arrow = <PopconfirmArrow className={`${rootClassName}__arrow`} />;

  return (
    <PopconfirmRoot
      {...others}
      disablePopupEnter={false}
      visible={visible}
      onVisibleChange={handleVisibleChange}
      ref={ref}
      trigger={trigger}
      className={clsx(rootClassName, className)}
      offset={offset}
      arrow={arrow}
      popup={popup}
      getPopupContainer={getPopupContainer}
      transitionClasses={`${rootClassName}-slide`}
    />
  );
});

if (isDevelopment) {
  Popconfirm.displayName = displayName;

  Popconfirm.propTypes = {
    getPopupContainer: PropTypes.func,
    onVisibleChange: PropTypes.func,
    visible: PropTypes.bool,
    title: PropTypes.node,
    className: PropTypes.string,
    offset: PropTypes.number,
    trigger: PropTypes.oneOf<PopperTrigger>(['click', 'contextMenu', 'custom', 'focus', 'hover']),
    icon: PropTypes.node,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
    cancelButtonProps: PropTypes.object,
    confirmButtonProps: PropTypes.object,
    cancelText: PropTypes.string,
    confirmText: PropTypes.string,
  };
}

export default Popconfirm;
