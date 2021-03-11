import clsx from 'clsx';
import React from 'react';
import PropTypes from 'prop-types';
import Popper, { PopperProps } from '../Popper';
import { styled } from '../styles';
import ThemeContext from '../ThemeProvider/ThemeContext';
import { isDevelopment } from '../utils/env';

export interface PopconfirmProps extends Omit<PopperProps, 'popup' | 'arrow' | 'transitionClasses'> {
  title?: React.ReactNode;
  content: React.ReactNode;
  transitionClassName?: string;
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
        transform: 'scaleX(1)',
        '&[data-placement^="left"]': {
          transformOrigin: '100% 50%',
        },
        '&[data-placement^="right"]': {
          transformOrigin: '0 50%',
        },
        '&[data-placement^="top"]': {
          transformOrigin: '50% 100%',
        },
        '&[data-placement^="bottom"]': {
          transformOrigin: '50% 0',
        },
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
  const { color, typography, elevations } = theme;
  const bgColor = color.background.paper;

  return {
    backgroundColor: bgColor,
    color: color.getContrastText(bgColor).text.primary,
    borderRadius: 4,
    minWidth: 160,
    ...typography.caption,
    ...elevations(16),
  };
});

const PopconfirmTitle = styled('div', {
  name: displayName,
  slot: 'Title',
})(({ theme }) => {
  const { color, typography } = theme;
  return {
    padding: '4px 12px',
    borderBottom: `1px solid ${color.divider}`,
    ...typography.subtitle2,
  };
});

const PopconfirmContent = styled('div', {
  name: displayName,
  slot: 'Content',
})(({ theme }) => {
  const { typography } = theme;
  return {
    padding: '8px 12px',
    ...typography.body2,
  };
});

const defaultGetPopupContainer = () => document.body;

const Popconfirm = React.forwardRef<unknown, PopconfirmProps>((props, ref) => {
  const {
    title,
    content,
    getPopupContainer = defaultGetPopupContainer,
    className,
    transitionClassName,
    offset = 12,
    ...others
  } = props;

  const { clsPrefix } = React.useContext(ThemeContext);

  const rootClassName = `${clsPrefix}-popconfirm`;

  const popup = (
    <PopconfirmPopup className={clsx(`${rootClassName}__popup`)}>
      {title && <PopconfirmTitle>{title}</PopconfirmTitle>}
      <PopconfirmContent>{content}</PopconfirmContent>
    </PopconfirmPopup>
  );

  const arrow = <PopconfirmArrow className={`${rootClassName}__arrow`} />;

  return (
    <PopconfirmRoot
      {...others}
      ref={ref}
      className={clsx(rootClassName, className)}
      offset={offset}
      arrow={arrow}
      popup={popup}
      getPopupContainer={getPopupContainer}
      transitionClasses={clsx(`${rootClassName}-slide`, transitionClassName)}
    />
  );
});

if (isDevelopment) {
  Popconfirm.displayName = displayName;

  Popconfirm.propTypes = {
    title: PropTypes.node,
    content: PropTypes.node.isRequired,
    getPopupContainer: PropTypes.func,
    className: PropTypes.string,
    transitionClassName: PropTypes.string,
    offset: PropTypes.number,
  };
}

export default Popconfirm;
