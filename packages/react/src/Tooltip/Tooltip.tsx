import PropTypes from 'prop-types';
import clsx from 'clsx';
import { isProduction, isServer } from '@xl-vision/utils';
import { Children, forwardRef, ReactElement, ReactNode } from 'react';
import Popper, { PopperChildrenProps, PopperProps } from '../Popper';
import { styled } from '../styles';
import { useTheme } from '../ThemeProvider';

export type TooltipChildrenProps = PopperChildrenProps & {};

export interface TooltipProps extends Omit<PopperProps, 'popup' | 'arrow'> {
  content: ReactNode;
  bgColor?: string;
  maxWidth?: number | string;
  hideArrow?: boolean;
}

const displayName = 'Tooltip';

const TooltipRoot = styled(Popper, {
  name: displayName,
  slot: 'Root',
})(({ theme }) => {
  const { clsPrefix, transition } = theme;

  return {
    [`.${clsPrefix}-tooltip`]: {
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
  const { color, typography, styleSize } = theme;
  const { hasWidth } = styleProps;

  const bgColor = color.emphasize(color.modes.dark.background.paper, 0.1);

  return {
    backgroundColor: bgColor,
    color: color.getContrastColor(bgColor).text.primary,
    padding: '4px 8px',
    borderRadius: styleSize.middle.borderRadius,

    ...typography.caption.style,
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

  const bgColor = color.emphasize(color.modes.dark.background.paper, 0.1);

  return {
    width: 8,
    height: 8,
    backgroundColor: bgColor,
    transform: 'translate(-4px, -4px) rotate(45deg)',
  };
});

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>((props, ref) => {
  const { clsPrefix, color } = useTheme();

  const {
    content,
    popupContainer,
    className,
    transitionClassName,
    bgColor,
    maxWidth,
    offset = 12,
    hideArrow,
    children,
    ...others
  } = props;

  const child = Children.only<ReactElement<TooltipChildrenProps>>(children);

  const rootClassName = `${clsPrefix}-tooltip`;

  const colorStyle = bgColor && {
    backgroundColor: bgColor,
    color: color.getContrastColor(bgColor).text.primary,
  };

  const popup = (
    <TooltipPopup
      className={clsx(`${rootClassName}__popup`, {
        [`${rootClassName}--width`]: maxWidth !== undefined,
      })}
      style={{ maxWidth, ...colorStyle }}
      styleProps={{
        hasWidth: maxWidth !== undefined,
      }}
    >
      {content}
    </TooltipPopup>
  );

  const arrow = <TooltipArrow className={`${rootClassName}__arrow`} style={{ ...colorStyle }} />;

  const rootClasses = clsx(rootClassName, className);

  return (
    <TooltipRoot
      role='tooltip'
      {...others}
      arrow={!hideArrow && arrow}
      className={rootClasses}
      offset={offset}
      popup={popup}
      popupContainer={popupContainer}
      ref={ref}
      transitionClassName={transitionClassName || rootClassName}
    >
      {child}
    </TooltipRoot>
  );
});

if (!isProduction) {
  Tooltip.displayName = displayName;

  Tooltip.propTypes = {
    children: PropTypes.element.isRequired,
    bgColor: PropTypes.string,
    className: PropTypes.string,
    content: PropTypes.node,
    maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    offset: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    popupContainer: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
      isServer ? PropTypes.any : PropTypes.instanceOf(Element),
    ]),
    transitionClassName: PropTypes.string,
  };
}

export default Tooltip;
