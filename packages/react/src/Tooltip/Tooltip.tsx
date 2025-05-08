import { isProduction, isServer } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { Children, forwardRef, ReactElement, ReactNode } from 'react';
import memoStyled from '../memoStyled';
import Popper, { PopperChildrenProps, PopperInstance, PopperProps } from '../Popper';
import { useTheme } from '../ThemeProvider';

export type TooltipChildrenProps = PopperChildrenProps & {};

export interface TooltipProps extends Omit<PopperProps, 'popup' | 'arrow' | 'content'> {
  content: ReactNode;
  bgColor?: string;
  hideArrow?: boolean;
  maxWidth?: number | string;
}

export type TooltipInstance = PopperInstance;

const displayName = 'Tooltip';

const TooltipRoot = memoStyled(Popper, {
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

const TooltipPopup = memoStyled('div', {
  name: displayName,
  slot: 'Popup',
})<TooltipPopupStyleProps>(({ theme }) => {
  const { colors, typography, sizes, elevations } = theme;

  return {
    backgroundColor: colors.background.spotlight,
    color: colors.text.spotlight,
    padding: '4px 8px',
    borderRadius: sizes.middle.borderRadius,
    boxShadow: elevations[2],
    ...typography.caption.style,
    variants: [
      {
        props: {
          hasWidth: true,
        },
        style: {
          whiteSpace: 'pre-wrap',
          textAlign: 'justify',
          wordWrap: 'break-word',
          wordBreak: 'break-all',
        },
      },
    ],
  };
});

const TooltipArrow = memoStyled('div', {
  name: displayName,
  slot: 'Arrow',
})(({ theme }) => {
  const { colors } = theme;

  const backgroundColor = colors.background.spotlight;

  return {
    width: 8,
    height: 8,
    backgroundColor,
    transform: 'translate(-4px, -4px) rotate(45deg)',
  };
});

const Tooltip = forwardRef<TooltipInstance, TooltipProps>((props, ref) => {
  const { clsPrefix } = useTheme();

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
  };

  const popup = (
    <TooltipPopup
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
