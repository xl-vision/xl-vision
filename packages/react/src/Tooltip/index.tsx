import PropTypes from 'prop-types';
import clsx from 'clsx';
import React from 'react';
import Popper, { PopperProps } from '../Popper';
import { createGlobalStyles, styled } from '../styles';
import ThemeContext from '../ThemeProvider/ThemeContext';
import { isDevelopment } from '../utils/env';

export interface TooltipProps
  extends Omit<PopperProps, 'popup' | 'arrow' | 'transitionClasses' | 'arrow'> {
  content: React.ReactNode;
  className?: string;
  transitionClassName?: string;
  bgColor?: string;
}

const displayName = 'Tooltip';

const GlobalStyles = createGlobalStyles(({ theme }) => {
  const { clsPrefix, transition } = theme;

  return {
    [`.${clsPrefix}-tooltip-slide`]: {
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

export type TooltipRootStyleProps = {
  bgColor: string;
};

export type TooltipArrowStyleProps = TooltipRootStyleProps;

const TooltipRoot = styled('div', {
  name: displayName,
  slot: 'Root',
})<TooltipRootStyleProps>(({ theme, styleProps }) => {
  const { color, elevations, typography } = theme;
  const { bgColor: bgcolorProp } = styleProps;
  return {
    backgroundColor: bgcolorProp,
    color: color.getContrastText(bgcolorProp).text.primary,
    padding: '4px 8px',
    borderRadius: '4px',
    ...typography.caption,
    ...elevations(2),
  };
});

const TooltipArrow = styled('div', {
  name: displayName,
  slot: 'Arrow',
})<TooltipArrowStyleProps>(({ styleProps }) => {
  const { bgColor: bgcolorProp } = styleProps;

  return {
    position: 'absolute',
    width: 0,
    height: 0,
    ':before': {
      position: 'absolute',
      content: '""',
      width: '8px',
      height: '8px',
      left: '-4px',
      top: '-4px',
      transform: 'rotate(45deg)',
      backgroundColor: bgcolorProp,
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

const defaultGetPopupContainer = () => document.body;

const Tooltip: React.FunctionComponent<TooltipProps> = (props) => {
  const { clsPrefix, color } = React.useContext(ThemeContext);

  const {
    content,
    getPopupContainer = defaultGetPopupContainer,
    className,
    transitionClassName,
    bgColor = color.grey[800],
    ...others
  } = props;

  const rootClassName = `${clsPrefix}-tooltip`;

  const popup = (
    <TooltipRoot styleProps={{ bgColor }} className={clsx(rootClassName, className)}>
      {content}
    </TooltipRoot>
  );

  const arrow = <TooltipArrow styleProps={{ bgColor }} />;

  return (
    <>
      <GlobalStyles />
      <Popper
        {...others}
        arrow={arrow}
        popup={popup}
        getPopupContainer={getPopupContainer}
        transitionClasses={clsx(`${rootClassName}-slide`, transitionClassName)}
      />
    </>
  );
};

if (isDevelopment) {
  Tooltip.displayName = displayName;

  Tooltip.propTypes = {
    content: PropTypes.node,
    getPopupContainer: PropTypes.func,
    className: PropTypes.string,
    transitionClassName: PropTypes.string,
    bgColor: PropTypes.string,
  };
}

export default Tooltip;
