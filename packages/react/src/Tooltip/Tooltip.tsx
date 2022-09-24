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
      styleProps={{
        hasWidth: maxWidth !== undefined,
      }}
      className={clsx(`${rootClassName}__popup`, {
        [`${rootClassName}--width`]: maxWidth !== undefined,
      })}
      style={{ maxWidth, ...colorStyle }}
    >
      {content}
    </TooltipPopup>
  );

  const arrow = <TooltipArrow style={{ ...colorStyle }} className={`${rootClassName}__arrow`} />;

  const rootClasses = clsx(rootClassName, className);

  return (
    <TooltipRoot
      role='tooltip'
      {...others}
      ref={ref}
      className={rootClasses}
      offset={offset}
      popup={popup}
      arrow={!hideArrow && arrow}
      popupContainer={popupContainer}
      transitionClassName={transitionClassName || rootClassName}
    >
      {child}
    </TooltipRoot>
  );
});

if (!isProduction) {
  Tooltip.displayName = displayName;

  Tooltip.propTypes = {
    content: PropTypes.node,
    popupContainer: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
      isServer ? PropTypes.any : PropTypes.instanceOf(Element),
    ]),
    className: PropTypes.string,
    transitionClassName: PropTypes.string,
    bgColor: PropTypes.string,
    maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    children: PropTypes.element.isRequired,
    offset: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  };
}

export default Tooltip;
