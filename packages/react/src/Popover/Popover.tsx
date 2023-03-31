import { isProduction, isServer } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { ReactNode, forwardRef } from 'react';
import Popper, { PopperProps, PopperTrigger } from '../Popper';
import { styled } from '../styles';
import { useTheme } from '../ThemeProvider';

export type PopoverProps = Omit<PopperProps, 'popup' | 'arrow' | 'title'> & {
  content: ReactNode;
  hideArrow?: boolean;
  title?: ReactNode;
};

const displayName = 'Popover';

const PopoverRoot = styled(Popper, {
  name: displayName,
  slot: 'Root',
})(({ theme }) => {
  const { clsPrefix, transitions } = theme;

  return {
    [`.${clsPrefix}-popover__inner`]: {
      ...transitions.fadeIn('&'),
      ...transitions.fadeOut('&'),
    },
  };
});

const PopoverArrow = styled('div', {
  name: displayName,
  slot: 'Arrow',
})(({ theme }) => {
  const { colors } = theme;
  const bgColor = colors.background.paper;

  return {
    width: 8,
    height: 8,
    backgroundColor: bgColor,
    transform: 'translate(-4px, -4px) rotate(45deg)',
  };
});

const PopoverPopup = styled('div', {
  name: displayName,
  slot: 'Popup',
})(({ theme }) => {
  const { colors, elevations } = theme;
  const bgColor = colors.background.paper;

  return {
    backgroundColor: bgColor,
    color: colors.getContrastText(bgColor).primary,
    borderRadius: 4,
    minWidth: 160,
    boxShadow: elevations[3],
  };
});

const PopoverTitle = styled('div', {
  name: displayName,
  slot: 'Title',
})(({ theme }) => {
  const { colors, typography, sizes } = theme;
  return {
    padding: '4px 12px',
    borderBottom: `${sizes.middle.border}px solid ${colors.divider}`,
    ...typography.subtitle2.style,
  };
});

const PopoverContent = styled('div', {
  name: displayName,
  slot: 'Content',
})(({ theme }) => {
  const { typography } = theme;
  return {
    padding: '8px 12px',
    ...typography.body2.style,
  };
});

const Popover = forwardRef<HTMLDivElement, PopoverProps>((props, ref) => {
  const {
    title,
    content,
    popupContainer,
    transitionClassName,
    offset = 12,
    // 支持触屏设备
    trigger = 'click',
    hideArrow,
    ...others
  } = props;

  const { clsPrefix } = useTheme();

  const rootClassName = `${clsPrefix}-popover`;

  const popup = (
    <PopoverPopup>
      {title && <PopoverTitle>{title}</PopoverTitle>}
      <PopoverContent>{content}</PopoverContent>
    </PopoverPopup>
  );

  const arrow = <PopoverArrow />;

  return (
    <PopoverRoot
      role='tooltip'
      {...others}
      arrow={!hideArrow && arrow}
      offset={offset}
      popup={popup}
      popupContainer={popupContainer}
      ref={ref}
      transitionClassName={transitionClassName || `${rootClassName}__inner`}
      trigger={trigger}
    />
  );
});

if (!isProduction) {
  Popover.displayName = displayName;

  const triggerPropType = PropTypes.oneOf<PopperTrigger>([
    'click',
    'contextMenu',
    'focus',
    'hover',
  ]).isRequired;

  Popover.propTypes = {
    content: PropTypes.node.isRequired,
    className: PropTypes.string,
    hideArrow: PropTypes.bool,
    offset: PropTypes.number,
    popupContainer: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
      isServer ? PropTypes.any : PropTypes.instanceOf(Element),
    ]),
    title: PropTypes.node,
    transitionClassName: PropTypes.string,
    trigger: PropTypes.oneOfType([triggerPropType, PropTypes.arrayOf(triggerPropType)]),
  };
}

export default Popover;
