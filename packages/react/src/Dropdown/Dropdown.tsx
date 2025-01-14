import { useConstantFn, useValueChange } from '@xl-vision/hooks';
import { isProduction, isServer } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { ReactElement, ReactNode, forwardRef, useRef, useEffect, useMemo } from 'react';
import DropdownContext from './DropdownContext';
import Popper, { PopperChildrenProps, PopperPlacement, PopperProps } from '../Popper';
import { styled } from '../styles';
import { useTheme } from '../ThemeProvider';

export interface DropdownProps extends Omit<PopperProps, 'popup' | 'arrow'> {
  children: ReactElement<PopperChildrenProps>;
  menus: ReactNode;
}

const displayName = 'Dropdown';

const DropdownRoot = styled(Popper, {
  name: displayName,
  slot: 'Root',
})(({ theme }) => {
  const { transitions, clsPrefix } = theme;

  return {
    [`.${clsPrefix}-dropdown`]: {
      ...transitions.fadeIn('&'),
      ...transitions.fadeOut('&'),
    },
  };
});

const DropdownPopup = styled('ul', {
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

// TODO [2025-07-01]: tab快捷键支持
const Dropdown = forwardRef<HTMLDivElement, DropdownProps>((props, ref) => {
  const {
    menus,
    children,
    placement = 'bottom',
    transitionClassName,
    offset = 12,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    popupContainer,
    ...others
  } = props;

  const { clsPrefix } = useTheme();

  const submenuCloseHandlersRef = useRef<Array<() => void>>([]);

  const [open, setOpen] = useValueChange(defaultOpen, openProp, onOpenChange);

  const setOpenWrapper = useConstantFn((value: boolean) => {
    if (!value) {
      submenuCloseHandlersRef.current.forEach((it) => it());
    }
    setOpen(value);
  });

  useEffect(() => {
    if (!open) {
      submenuCloseHandlersRef.current.forEach((it) => it());
    }
  }, [open]);

  const rootClassName = `${clsPrefix}-dropdown`;

  const memorizedValue = useMemo(() => {
    return {
      submenuCloseHandlers: submenuCloseHandlersRef.current,
      setOpen: setOpenWrapper,
    };
  }, [setOpenWrapper]);

  const popup = (
    <DropdownPopup>
      <DropdownContext.Provider value={memorizedValue}>{menus}</DropdownContext.Provider>
    </DropdownPopup>
  );

  return (
    <DropdownRoot
      {...others}
      offset={offset}
      open={open}
      placement={placement}
      popup={popup}
      popupContainer={popupContainer}
      ref={ref}
      transitionClassName={transitionClassName || rootClassName}
      // eslint-disable-next-line react/jsx-handler-names
      onOpenChange={setOpen}
    >
      {children}
    </DropdownRoot>
  );
});

if (!isProduction) {
  Dropdown.displayName = displayName;

  Dropdown.propTypes = {
    children: PropTypes.element.isRequired,
    menus: PropTypes.node.isRequired,
    className: PropTypes.string,
    defaultOpen: PropTypes.bool,
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
    onOpenChange: PropTypes.func,
  };
}

export default Dropdown;
