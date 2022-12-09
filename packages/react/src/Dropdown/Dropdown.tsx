import { useConstantFn } from '@xl-vision/hooks';
import { isProduction, isServer } from '@xl-vision/utils';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { ReactElement, ReactNode, forwardRef, useContext, useRef, useEffect, useMemo } from 'react';
import usePropChange from '../hooks/usePropChange';
import Popper, { PopperPlacement, PopperProps } from '../Popper';
import { styled } from '../styles';
import ThemeContext from '../ThemeProvider/ThemeContext';
import DropdownContext from './DropdownContext';

export interface DropdownProps extends Omit<PopperProps, 'popup' | 'arrow'> {
  children: ReactElement;
  menus: ReactNode;
}

const displayName = 'Dropdown';

const DropdownRoot = styled(Popper, {
  name: displayName,
  slot: 'Root',
})(({ theme }) => {
  const { clsPrefix, transition } = theme;

  return {
    [`.${clsPrefix}-dropdown`]: {
      ...transition.fadeIn('&'),
      ...transition.fadeOut('&'),
    },
  };
});

const DropdownPopup = styled('ul', {
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

// TODO [2023-01-01]: tab快捷键支持
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
    className,
    ...others
  } = props;

  const { clsPrefix } = useContext(ThemeContext);

  const submenuCloseHandlersRef = useRef<Array<() => void>>([]);

  const [open, setOpen] = usePropChange(defaultOpen, openProp, onOpenChange);

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

  const rootClasses = clsx(rootClassName, className);

  const memorizedValue = useMemo(() => {
    return {
      submenuCloseHandlers: submenuCloseHandlersRef.current,
      setOpen: setOpenWrapper,
    };
  }, [setOpenWrapper]);

  const popup = (
    <DropdownPopup className={`${rootClassName}__popup`}>
      <DropdownContext.Provider value={memorizedValue}>{menus}</DropdownContext.Provider>
    </DropdownPopup>
  );

  return (
    <DropdownRoot
      {...others}
      className={rootClasses}
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
