import { useConstantFn, useValueChange } from '@xl-vision/hooks';
import { RightOutlined } from '@xl-vision/icons';
import { CSSObject } from '@xl-vision/styled-engine';
import { isProduction, isServer } from '@xl-vision/utils';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { ReactNode, forwardRef, useContext, useCallback, useEffect } from 'react';
import BaseButton from '../BaseButton';
import Popper, { PopperPlacement, PopperProps, PopperTrigger } from '../Popper';
import { styled } from '../styles';
import { useTheme } from '../ThemeProvider';
import DropdownContext from './DropdownContext';

export interface DropdownSubmenuProps
  extends Omit<
    PopperProps,
    'popup' | 'arrow' | 'transitionClasses' | 'disablePopupEnter' | 'children' | 'title'
  > {
  children: ReactNode;
  title: ReactNode;
  disabled?: boolean;
  transitionClassName?: string;
}

const displayName = 'DropdownSubmenu';

const DropdownSubmenuRoot = styled(Popper, {
  name: displayName,
  slot: 'Root',
})(({ theme }) => {
  const { clsPrefix, transition } = theme;

  return {
    [`.${clsPrefix}-dropdown-submenu`]: {
      ...transition.fadeIn('&'),
      ...transition.fadeOut('&'),
    },
    '>li': {
      display: 'block',
      padding: 0,
      margin: 0,
    },
  };
});

export type DropdownSubmenuItemButtonStyleProps = {
  disabled?: boolean;
};

const DropdownSubmenuItemButton = styled(BaseButton, {
  name: displayName,
  slot: 'Button',
})<DropdownSubmenuItemButtonStyleProps>(({ theme, styleProps }) => {
  const { color, transition, typography, clsPrefix } = theme;

  const { disabled } = styleProps;

  const styles: CSSObject = {
    padding: '5px 12px',
    transition: transition.standard('all'),
    color: color.text.primary,
    // 不设置会导致有间隙，原因未知
    width: '100%',
    textAlign: 'left',
    ...typography.body2.style,
    [`.${clsPrefix}-base-button__inner`]: {
      paddingRight: 14 + 4,
    },
  };

  if (disabled) {
    styles.opacity = color.action.disabled;
  } else {
    styles[':hover'] = {
      backgroundColor: color.themes.primary.color,
      color: color.themes.primary.text.primary,
    };
  }

  return styles;
});

const DropdownSubmenuIcon = styled(RightOutlined, {
  name: displayName,
  slot: 'Icon',
})(() => {
  return {
    position: 'absolute',
    right: 0,
    top: 2,
  };
});

const DropdownSubmenuPopup = styled('ul', {
  name: displayName,
  slot: 'Popup',
})(({ theme }) => {
  const { color, elevations, styleSize } = theme;

  return {
    backgroundColor: color.background.paper,
    color: color.text.primary,
    borderRadius: styleSize.middle.borderRadius,
    padding: '5px 0',
    listStyle: 'none',
    margin: 0,
    ...elevations(8),
  };
});

const defaultTrigger: Array<PopperTrigger> = ['click', 'hover'];
const defaultGetPopupContainer = () => document.body;

const DropdownSubmenu = forwardRef<HTMLDivElement, DropdownSubmenuProps>((props, ref) => {
  const {
    title,
    children,
    placement = 'right-start',
    transitionClassName,
    className,
    offset = 8,
    trigger = defaultTrigger,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    popupContainer = defaultGetPopupContainer,
    disabled,
    ...others
  } = props;

  const [open, setOpen] = useValueChange(defaultOpen, openProp, onOpenChange);

  const { clsPrefix } = useTheme();
  const { submenuCloseHandlers } = useContext(DropdownContext);

  const handleOpenChange = useConstantFn((value: boolean) => {
    if (disabled) {
      return;
    }
    setOpen(value);
  });

  const closeHandler = useCallback(() => {
    return setOpen(false);
  }, [setOpen]);

  useEffect(() => {
    submenuCloseHandlers.push(closeHandler);
    return () => {
      const index = submenuCloseHandlers.indexOf(closeHandler);
      if (index > -1) {
        submenuCloseHandlers.splice(index, 1);
      }
    };
  }, [submenuCloseHandlers, closeHandler]);

  const rootClassName = `${clsPrefix}-dropdown-submenu`;

  const rootClasses = clsx(
    rootClassName,
    {
      [`${rootClassName}--disabled`]: disabled,
    },
    className,
  );

  const popup = (
    <DropdownSubmenuPopup className={`${rootClassName}__popup`}>{children}</DropdownSubmenuPopup>
  );

  return (
    <DropdownSubmenuRoot
      {...others}
      className={rootClasses}
      offset={offset}
      open={open}
      placement={placement}
      popup={popup}
      popupContainer={popupContainer}
      ref={ref}
      transitionClassName={clsx(rootClassName, transitionClassName)}
      trigger={trigger}
      onOpenChange={handleOpenChange}
    >
      <li className={`${rootClassName}__inner`}>
        <DropdownSubmenuItemButton
          // cant use prop disabled
          // see https://github.com/facebook/react/issues/10109
          // disabled={disabled}
          aria-disabled={disabled}
          className={`${rootClassName}__button`}
          disableRipple={disabled}
          styleProps={{ disabled }}
        >
          {title}
          <DropdownSubmenuIcon className={`${rootClassName}__icon`} />
        </DropdownSubmenuItemButton>
      </li>
    </DropdownSubmenuRoot>
  );
});

if (!isProduction) {
  DropdownSubmenu.displayName = displayName;

  const triggerPropType = PropTypes.oneOf<PopperTrigger>([
    'click',
    'contextMenu',
    // 'custom',
    'focus',
    'hover',
  ]).isRequired;

  DropdownSubmenu.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.node.isRequired,
    className: PropTypes.string,
    defaultOpen: PropTypes.bool,
    disabled: PropTypes.bool,
    offset: PropTypes.number,
    open: PropTypes.bool,
    placement: PropTypes.oneOf<PopperPlacement>([
      'top',
      'top-start',
      'top-end',
      'bottom',
      'bottom-start',
      'bottom-end',
      'left',
      'left-start',
      'left-end',
      'right',
      'right-start',
      'right-end',
    ]),
    popupContainer: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
      isServer ? PropTypes.any : PropTypes.instanceOf(Element),
    ]),
    transitionClassName: PropTypes.string,
    trigger: PropTypes.oneOfType([triggerPropType, PropTypes.arrayOf(triggerPropType)]),
    onOpenChange: PropTypes.func,
  };
}

export default DropdownSubmenu;
