import { isProduction, isServer } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { ReactNode, forwardRef } from 'react';
import { useConfig } from '../ConfigProvider';
import Popper, { PopperProps, PopperTrigger } from '../Popper';
import { styled } from '../styles';

export type PopoverProps = Omit<PopperProps, 'popup' | 'arrow' | 'title'> & {
  content: ReactNode;
  hideArrow?: boolean;
  title?: ReactNode;
};

const displayName = 'Popover';

const PopoverRoot = styled(Popper, {
  name: displayName,
  slot: 'Root',
})(({ clsPrefix, theme }) => {
  const { transition } = theme;

  return {
    [`.${clsPrefix}-popover__inner`]: {
      ...transition.fadeIn('&'),
      ...transition.fadeOut('&'),
    },
  };
});

const PopoverArrow = styled('div', {
  name: displayName,
  slot: 'Arrow',
})(({ theme }) => {
  const { color } = theme;
  const bgColor = color.background.paper;

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
  const { color, elevations } = theme;
  const bgColor = color.background.paper;

  return {
    backgroundColor: bgColor,
    color: color.getContrastColor(bgColor).text.primary,
    borderRadius: 4,
    minWidth: 160,
    ...elevations(8),
  };
});

const PopoverTitle = styled('div', {
  name: displayName,
  slot: 'Title',
})(({ theme }) => {
  const { color, typography, styleSize } = theme;
  return {
    padding: '4px 12px',
    borderBottom: `${styleSize.middle.border}px solid ${color.divider}`,
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

  const { clsPrefix } = useConfig();

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
