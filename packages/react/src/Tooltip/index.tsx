import PropTypes from 'prop-types';
import clsx from 'clsx';
import React from 'react';
import Popper, { PopperChildrenProps, PopperProps, PopperTrigger } from '../Popper';
import { styled } from '../styles';
import ThemeContext from '../ThemeProvider/ThemeContext';
import { isDevelopment } from '../utils/env';
import useEventCallback from '../hooks/useEventCallback';
import { omit, oneOf } from '../utils/function';
import usePropChange from '../hooks/usePropChange';

export interface TooltipChildrenProps extends PopperChildrenProps {
  onTouchStart?: React.TouchEventHandler<any>;
  onTouchEnd?: React.TouchEventHandler<any>;
}

export type TooltipTrigger = PopperTrigger | 'touch';

export interface TooltipProps
  extends Omit<PopperProps, 'popup' | 'arrow' | 'transitionClasses' | 'children' | 'trigger'> {
  content: React.ReactNode;
  transitionClassName?: string;
  bgColor?: string;
  maxWidth?: number | string;
  showArrow?: boolean;
  children: React.ReactElement<TooltipChildrenProps>;
  trigger: TooltipTrigger | Array<TooltipTrigger>;
  touchShowDelay?: number;
  touchHideDelay?: number;
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
  const bgColor = color.modes.dark.background.paper;

  return {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: bgColor,

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

const defaultTrigger: Array<TooltipTrigger> = ['hover', 'touch'];

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
    touchHideDelay,
    touchShowDelay,
    // 支持触屏设备
    trigger = defaultTrigger,
    visible: visibleProp,
    defaultVisible = false,
    onVisibleChange,
    showArrow,
    children,
    ...others
  } = props;

  const child = React.Children.only<React.ReactElement<TooltipChildrenProps>>(children);

  const triggers = Array.isArray(trigger) ? trigger : [trigger];

  const extraTriggers = omit(trigger, '')

  const [visible, handleVisibleChange] = usePropChange(
    defaultVisible,
    visibleProp,
    onVisibleChange,
  );

  const touchDelayTimerRef = React.useRef<NodeJS.Timeout>();

  const prevUserSelectRef = React.useRef<string>();

  const stopTouchInteraction = React.useCallback(() => {
    if (prevUserSelectRef.current !== undefined) {
      document.body.style.webkitUserSelect = prevUserSelectRef.current;
      prevUserSelectRef.current = undefined;
    }
    if (touchDelayTimerRef.current !== undefined) {
      clearTimeout(touchDelayTimerRef.current);
      touchDelayTimerRef.current = undefined;
    }
  }, []);

  const isTouchTrigger = useEventCallback(() => {
    const triggers = Array.isArray(trigger) ? trigger : [trigger];
    if (oneOf(triggers, 'custom')) {
      return false;
    }
    return oneOf(triggers, 'touch');
  });

  const handleReferenceTouchStart: React.TouchEventHandler<any> = useEventCallback((e) => {
    if (isTouchTrigger()) {
      stopTouchInteraction();
      prevUserSelectRef.current = document.body.style.webkitUserSelect;
      // Prevent iOS text selection on long-tap.
      document.body.style.webkitUserSelect = 'none';
      touchDelayTimerRef.current = setTimeout(() => {
        stopTouchInteraction();
        handleVisibleChange(true);
      }, touchShowDelay);
    }

    child.props?.onTouchStart?.(e);
  });

  const handleReferenceTouchEnd: React.TouchEventHandler<any> = useEventCallback((e) => {
    // call after mouseenter
    stopTouchInteraction();

    touchDelayTimerRef.current = setTimeout(() => {}, touchHideDelay);
    handleVisibleChange(false);
    child.props?.onTouchEnd?.(e);
  });

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

  const arrow = <TooltipArrow style={{ ...colorStyle }} className={`${rootClassName}__arrow`} />;

  return (
    <TooltipRoot
      {...others}
      ref={ref}
      visible={visible}
      onVisibleChange={handleVisibleChange}
      trigger={trigger}
      className={clsx(rootClassName, className)}
      offset={offset}
      popup={popup}
      arrow={showArrow ? arrow : undefined}
      getPopupContainer={getPopupContainer}
      transitionClasses={clsx(`${rootClassName}-slide`, transitionClassName)}
    >
      {React.cloneElement(child, {
        onTouchStart: handleReferenceTouchStart,
        onTouchEnd: handleReferenceTouchEnd,
      })}
    </TooltipRoot>
  );
});

if (isDevelopment) {
  Tooltip.displayName = displayName;

  const triggerPropType = PropTypes.oneOf<TooltipTrigger>([
    'click',
    'contextMenu',
    'custom',
    'focus',
    'hover',
    'touch',
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
    showArrow: PropTypes.bool,
  };
}

export default Tooltip;
