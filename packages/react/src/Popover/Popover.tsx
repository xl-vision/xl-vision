import clsx from 'clsx';
import PropTypes from 'prop-types';
import { isProduction, isServer } from '@xl-vision/utils';
import { ReactNode, forwardRef } from 'react';
import Popper, { PopperProps, PopperTrigger } from '../Popper';
import { styled } from '../styles';
import { useTheme } from '../ThemeProvider';

export type PopoverProps = Omit<PopperProps, 'popup' | 'arrow' | 'title'> & {
  title?: ReactNode;
  content: ReactNode;
  hideArrow?: boolean;
};

const displayName = 'Popover';

const PopoverRoot = styled(Popper, {
  name: displayName,
  slot: 'Root',
})(({ theme }) => {
  const { clsPrefix, transition } = theme;

  return {
    [`.${clsPrefix}-popper__inner`]: {
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
    [`.${clsPrefix}-popover`]: {
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

const Popover = forwardRef<unknown, PopoverProps>((props, ref) => {
  const {
    title,
    content,
    popupContainer,
    className,
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
    <PopoverPopup className={clsx(`${rootClassName}__popup`)}>
      {title && <PopoverTitle className={`${rootClassName}__title`}>{title}</PopoverTitle>}
      <PopoverContent className={`${rootClassName}__content`}>{content}</PopoverContent>
    </PopoverPopup>
  );

  const arrow = <PopoverArrow className={`${rootClassName}__arrow`} />;

  const rootClasses = clsx(rootClassName, className);

  return (
    <PopoverRoot
      role='tooltip'
      {...others}
      ref={ref}
      trigger={trigger}
      className={rootClasses}
      offset={offset}
      arrow={!hideArrow && arrow}
      popup={popup}
      popupContainer={popupContainer}
      transitionClassName={transitionClassName || rootClassName}
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
    title: PropTypes.node,
    content: PropTypes.node.isRequired,
    popupContainer: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
      isServer ? PropTypes.any : PropTypes.instanceOf(Element),
    ]),
    className: PropTypes.string,
    transitionClassName: PropTypes.string,
    offset: PropTypes.number,
    trigger: PropTypes.oneOfType([triggerPropType, PropTypes.arrayOf(triggerPropType)]),
    hideArrow: PropTypes.bool,
  };
}

export default Popover;
