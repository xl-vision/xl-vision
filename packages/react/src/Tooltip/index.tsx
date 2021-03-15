import PropTypes from 'prop-types';
import clsx from 'clsx';
import React from 'react';
import Popper, { PopperProps, PopperTrigger } from '../Popper';
import { styled } from '../styles';
import ThemeContext from '../ThemeProvider/ThemeContext';
import { isDevelopment } from '../utils/env';

export interface TooltipProps extends Omit<PopperProps, 'popup' | 'arrow' | 'transitionClasses'> {
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
      ...transition.fadeIn('&'),
      ...transition.fadeOut('&'),
    },
  };
});

export type TooltipPopupStyleProps = {
  hasWidth: boolean;
};

const TooltipPopup = styled('div', {
  name: displayName,
  slot: 'Popup',
})<TooltipPopupStyleProps>(({ theme, styleProps }) => {
  const { color, typography } = theme;
  const { hasWidth } = styleProps;

  const bgColor = color.modes.dark.background.paper;

  return {
    backgroundColor: bgColor,
    color: color.getContrastText(bgColor).text.primary,
    padding: '2px 8px',
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

const defaultGetPopupContainer = () => document.body;

const defaultTrigger: Array<PopperTrigger> = ['hover', 'click'];

const Tooltip = React.forwardRef<unknown, TooltipProps>((props, ref) => {
  const { clsPrefix, color } = React.useContext(ThemeContext);

  const {
    content,
    getPopupContainer = defaultGetPopupContainer,
    className,
    transitionClassName,
    bgColor,
    maxWidth,
    offset = 8,
    // 支持触屏设备
    trigger = defaultTrigger,
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
      className={clsx(`${rootClassName}__content`, {
        [`${rootClassName}--width`]: maxWidth !== undefined,
      })}
      style={{ maxWidth, ...colorStyle }}
    >
      {content}
    </TooltipPopup>
  );

  return (
    <TooltipRoot
      {...others}
      ref={ref}
      trigger={trigger}
      className={clsx(rootClassName, className)}
      offset={offset}
      popup={popup}
      getPopupContainer={getPopupContainer}
      transitionClasses={clsx(`${rootClassName}-slide`, transitionClassName)}
    />
  );
});

if (isDevelopment) {
  Tooltip.displayName = displayName;

  const triggerPropType = PropTypes.oneOf<PopperTrigger>([
    'click',
    'contextMenu',
    'custom',
    'focus',
    'hover',
  ]).isRequired;

  Tooltip.propTypes = {
    content: PropTypes.node,
    getPopupContainer: PropTypes.func,
    className: PropTypes.string,
    transitionClassName: PropTypes.string,
    bgColor: PropTypes.string,
    maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    offset: PropTypes.number,
    trigger: PropTypes.oneOfType([triggerPropType, PropTypes.arrayOf(triggerPropType)]),
  };
}

export default Tooltip;
