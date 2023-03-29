import { isProduction, isServer } from '@xl-vision/utils';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Children, forwardRef, ReactElement, ReactNode } from 'react';
import { useConfig } from '../ConfigProvider';
import Popper, { PopperChildrenProps, PopperProps } from '../Popper';
import { styled } from '../styles';
import { useTheme } from '../ThemeProvider';

export type TooltipChildrenProps = PopperChildrenProps & {};

export interface TooltipProps extends Omit<PopperProps, 'popup' | 'arrow'> {
  content: ReactNode;
  bgColor?: string;
  hideArrow?: boolean;
  maxWidth?: number | string;
}

const displayName = 'Tooltip';

const TooltipRoot = styled(Popper, {
  name: displayName,
  slot: 'Root',
})(({ theme }) => {
  const { clsPrefix, transitions } = theme;

  return {
    [`.${clsPrefix}-tooltip__inner`]: {
      ...transitions.fadeIn('&'),
      ...transitions.fadeOut('&'),
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
  const { colors, typography, sizes } = theme;
  const { hasWidth } = styleProps;

  // const bgColor = colors.emphasize(colors.modes.dark.background.paper, 0.1);

  return {
    // backgroundColor: bgColor,
    // color: colors.getContrastText(bgColor).primary,
    padding: '4px 8px',
    borderRadius: sizes.middle.borderRadius,

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
  const { colors } = theme;

  // const bgColor = colors.emphasize(colors.modes.dark.background.paper, 0.1);

  return {
    width: 8,
    height: 8,
    // backgroundColor: bgColor,
    transform: 'translate(-4px, -4px) rotate(45deg)',
  };
});

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>((props, ref) => {
  const { colors } = useTheme();
  const { clsPrefix } = useConfig();

  const {
    content,
    popupContainer,
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
    color: colors.getContrastText(bgColor).primary,
  };

  const popup = (
    <TooltipPopup
      className={clsx({
        [`${rootClassName}}__popup--width`]: maxWidth !== undefined,
      })}
      style={{ maxWidth, ...colorStyle }}
      styleProps={{
        hasWidth: maxWidth !== undefined,
      }}
    >
      {content}
    </TooltipPopup>
  );

  const arrow = <TooltipArrow style={{ ...colorStyle }} />;

  return (
    <TooltipRoot
      role='tooltip'
      {...others}
      arrow={!hideArrow && arrow}
      offset={offset}
      popup={popup}
      popupContainer={popupContainer}
      ref={ref}
      transitionClassName={transitionClassName || `${rootClassName}__inner`}
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
