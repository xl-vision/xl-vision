import PropTypes from 'prop-types';
import clsx from 'clsx';
import React from 'react';
import Popper, { PopperProps } from '../Popper';
import { styled } from '../styles';
import ThemeContext from '../ThemeProvider/ThemeContext';
import { isDevelopment } from '../utils/env';

export interface TooltipProps
  extends Omit<PopperProps, 'popup' | 'arrow' | 'transitionClasses' | 'arrow'> {
  content: React.ReactNode;
  transitionClassName?: string;
  bgColor?: string;
  maxWidth?: number | string;
}

const displayName = 'Tooltip';

const TooltipRoot = styled(Popper, {
  name: displayName,
  slot: 'Root',
})(({ theme }) => {
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
  hasWidth: boolean;
};

const TooltipPopup = styled('div', {
  name: displayName,
  slot: 'Popup',
})<TooltipRootStyleProps>(({ theme, styleProps }) => {
  const { color, typography } = theme;
  const { hasWidth } = styleProps;

  const bgColor = color.modes.dark.background.paper;

  return {
    backgroundColor: bgColor,
    color: color.getContrastText(bgColor).text.primary,
    padding: '4px 8px',
    borderRadius: '4px',
    ...typography.caption,
    ...(hasWidth && {
      whiteSpace: 'pre-wrap',
      textAlign: 'justify',
      wordWrap: 'break-word',
      wordBreak: 'break-all',
    }),
  };
});

const TooltipArrow = styled('div', {
  name: displayName,
  slot: 'Arrow',
})(({ theme }) => {
  const { color } = theme;

  return {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: color.grey[800],

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

const defaultGetPopupContainer = () => document.body;

const Tooltip = React.forwardRef<unknown, TooltipProps>((props, ref) => {
  const { clsPrefix, color } = React.useContext(ThemeContext);

  const {
    content,
    getPopupContainer = defaultGetPopupContainer,
    className,
    transitionClassName,
    bgColor,
    maxWidth,
    offset = 12,
    ...others
  } = props;

  const rootClassName = `${clsPrefix}-tooltip`;

  const colorStyle = bgColor && {
    backgroundColor: bgColor,
    color: color.getContrastText(bgColor).text.primary,
  };

  const popup = (
    <TooltipPopup
      styleProps={{ hasWidth: maxWidth !== undefined }}
      className={clsx(
        rootClassName,
        {
          [`${rootClassName}--width`]: maxWidth !== undefined,
        },
        className,
      )}
      style={{ maxWidth, ...colorStyle }}
    >
      {content}
    </TooltipPopup>
  );

  const arrow = <TooltipArrow style={{ ...colorStyle }} className={`${rootClassName}__arrow`} />;

  return (
    <>
      <TooltipRoot
        {...others}
        ref={ref}
        offset={offset}
        arrow={arrow}
        popup={popup}
        getPopupContainer={getPopupContainer}
        transitionClasses={clsx(`${rootClassName}-slide`, transitionClassName)}
      />
    </>
  );
});

if (isDevelopment) {
  Tooltip.displayName = displayName;

  Tooltip.propTypes = {
    content: PropTypes.node,
    getPopupContainer: PropTypes.func,
    className: PropTypes.string,
    transitionClassName: PropTypes.string,
    bgColor: PropTypes.string,
    maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    offset: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };
}

export default Tooltip;
