import { useConstantFn, useValueChange } from '@xl-vision/hooks';
import { RightOutlined } from '@xl-vision/icons';
import { isProduction, isServer } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { ReactNode, forwardRef, useContext, useCallback, useEffect } from 'react';
import DropdownContext from './DropdownContext';
import BaseButton from '../BaseButton';
import memoStyled from '../memoStyled';
import Popper, { PopperInstance, PopperPlacement, PopperProps, PopperTrigger } from '../Popper';
import { useTheme } from '../ThemeProvider';

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

export type DropdownSubmenuInstance = PopperInstance;

const displayName = 'DropdownSubmenu';

const DropdownSubmenuRoot = memoStyled(Popper, {
  name: displayName,
  slot: 'Root',
})<{ disabled?: boolean }>(({ theme }) => {
  const { transitions, clsPrefix } = theme;

  return {
    [`.${clsPrefix}-dropdown-submenu`]: {
      ...transitions.fadeIn('&'),
      ...transitions.fadeOut('&'),
    },
    '> li': {
      display: 'block',
      padding: 0,
      margin: 0,
    },
  };
});

const DropdownSubmenuReference = memoStyled('li', {
  name: displayName,
  slot: 'Reference',
})(() => {
  return {};
});

export type DropdownSubmenuItemButtonStyleProps = {
  disabled?: boolean;
};

const DropdownSubmenuItemButton = memoStyled(BaseButton, {
  name: displayName,
  slot: 'Button',
})<DropdownSubmenuItemButtonStyleProps>(({ theme }) => {
  const { colors, transitions, typography, clsPrefix } = theme;

  return {
    padding: '5px 12px',
    transition: transitions.standard('all'),
    color: colors.text.primary,
    // 不设置会导致有间隙，原因未知
    width: '100%',
    textAlign: 'left',
    ...typography.body2.style,
    '&:hover': {
      backgroundColor: colors.background.hover,
      // color: colors.themes.primary.text.primary,
    },
    [`.${clsPrefix}-base-button__inner`]: {
      paddingRight: 14 + 4,
    },
    variants: [
      {
        props: {
          disabled: true,
        },
        style: {
          opacity: colors.opacity.disabled,
          '&:hover': {
            backgroundColor: 'inherit',
          },
        },
      },
    ],
  };
});

const DropdownSubmenuIcon = memoStyled(RightOutlined, {
  name: displayName,
  slot: 'Icon',
})(() => {
  return {
    position: 'absolute',
    right: 0,
    top: 2,
  };
});

const DropdownSubmenuPopup = memoStyled('ul', {
  name: displayName,
  slot: 'Popup',
})(({ theme }) => {
  const { colors, elevations, sizes } = theme;

  return {
    backgroundColor: colors.background.popper,
    color: colors.text.primary,
    borderRadius: sizes.middle.borderRadius,
    padding: '5px 0',
    listStyle: 'none',
    margin: 0,
    boxShadow: elevations[3],
  };
});

const defaultTrigger: Array<PopperTrigger> = ['click', 'hover'];
const defaultGetPopupContainer = () => document.body;

const DropdownSubmenu = forwardRef<DropdownSubmenuInstance, DropdownSubmenuProps>((props, ref) => {
  const {
    title,
    children,
    placement = 'right-start',
    transitionClassName,
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
      if (index !== -1) {
        submenuCloseHandlers.splice(index, 1);
      }
    };
  }, [submenuCloseHandlers, closeHandler]);

  const rootClassName = `${clsPrefix}-dropdown-submenu`;

  const popup = <DropdownSubmenuPopup>{children}</DropdownSubmenuPopup>;

  return (
    <DropdownSubmenuRoot
      {...others}
      offset={offset}
      open={open}
      placement={placement}
      popup={popup}
      popupContainer={popupContainer}
      ref={ref}
      styleProps={{
        disabled,
      }}
      transitionClassName={rootClassName || transitionClassName}
      trigger={trigger}
      onOpenChange={handleOpenChange}
    >
      <DropdownSubmenuReference>
        <DropdownSubmenuItemButton
          // cant use prop disabled
          // see https://github.com/facebook/react/issues/10109
          // disabled={disabled}
          aria-disabled={disabled}
          disableRipple={disabled}
          styleProps={{ disabled }}
        >
          {title}
          <DropdownSubmenuIcon />
        </DropdownSubmenuItemButton>
      </DropdownSubmenuReference>
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
