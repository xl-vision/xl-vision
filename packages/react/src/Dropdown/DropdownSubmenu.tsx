import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import useEventCallback from '../hooks/useEventCallback';
import Popper, { PopperPlacement, PopperProps, PopperTrigger } from '../Popper';
import { styled } from '../styles';
import ThemeContext from '../ThemeProvider/ThemeContext';
import { isDevelopment } from '../utils/env';
import DropdownContext from './DropdownContext';

export interface DropdownSubmenuProps
  extends Omit<PopperProps, 'popup' | 'arrow' | 'transitionClasses' | 'disablePopupEnter'> {
  children: React.ReactElement;
  menus: React.ReactNode;
  transitionClassName?: string;
}

const displayName = 'DropdownSubmenu';

const DropdownSubmenuRoot = styled(Popper, {
  name: displayName,
  slot: 'Root',
})(({ theme }) => {
  const { clsPrefix, transition } = theme;

  return {
    [`.${clsPrefix}-dropdown-submenu-slide`]: {
      '&-enter-active, &-leave-active': {
        transition: transition.standard(['transform', 'opacity']),
        opacity: 1,
        '&[data-placement^=top], &[data-placement^=bottom]': {
          transform: 'scaleY(1)',
        },
        '&[data-placement^=left], &[data-placement^=right]': {
          transform: 'scaleX(1)',
        },
      },
      '&-enter, &-leave-to': {
        opacity: 0,
        '&[data-placement^=top], &[data-placement^=bottom]': {
          transform: 'scaleY(0)',
        },
        '&[data-placement^=left], &[data-placement^=right]': {
          transform: 'scaleX(0)',
        },
      },
    },
  };
});

const DropdownSubmenuPopup = styled('ul', {
  name: displayName,
  slot: 'Popup',
})(({ theme }) => {
  const { color, elevations } = theme;

  return {
    backgroundColor: color.background.paper,
    color: color.text.primary,
    borderRadius: 4,
    padding: '5px 0',
    listStyle: 'none',
    margin: 0,
    ...elevations(16),
  };
});

const defaultTrigger: Array<PopperTrigger> = ['click', 'hover'];
const defaultGetPopupContainer = () => document.body;

const DropdownSubmenu = React.forwardRef<HTMLDivElement, DropdownSubmenuProps>((props, ref) => {
  const {
    menus,
    children,
    placement = 'bottom',
    transitionClassName,
    offset = 8,
    trigger = defaultTrigger,
    visible: visibleProp,
    defaultVisible = false,
    onVisibleChange,
    getPopupContainer = defaultGetPopupContainer,
    ...others
  } = props;

  const { clsPrefix } = React.useContext(ThemeContext);

  const submenuCloseHandlersRef = React.useRef<Array<() => void>>([]);

  const [visible, setVisible] = React.useState(() => {
    if (visibleProp === undefined) {
      return defaultVisible;
    }
    return visibleProp;
  });

  const handleVisibleChange = useEventCallback((v: boolean) => {
    if (visibleProp === undefined) {
      setVisible(v);
      if (!v) {
        submenuCloseHandlersRef.current.forEach((it) => it());
      }
    }
    onVisibleChange?.(v);
  });

  React.useEffect(() => {
    if (visibleProp !== undefined) {
      setVisible(visibleProp);
      if (!visibleProp) {
        submenuCloseHandlersRef.current.forEach((it) => it());
      }
    }
  }, [visibleProp]);

  const rootClassName = `${clsPrefix}-dropdown-submenu`;
  const popup = (
    <DropdownSubmenuPopup>
      <DropdownContext.Provider value={{ submenuCloseHandlers: submenuCloseHandlersRef.current }}>
        {menus}
      </DropdownContext.Provider>
    </DropdownSubmenuPopup>
  );

  return (
    <DropdownSubmenuRoot
      {...others}
      ref={ref}
      disablePopupEnter={false}
      visible={visible}
      onVisibleChange={handleVisibleChange}
      trigger={trigger}
      placement={placement}
      popup={popup}
      offset={offset}
      getPopupContainer={getPopupContainer}
      transitionClasses={clsx(`${rootClassName}-slide`, transitionClassName)}
    >
      {children}
    </DropdownSubmenuRoot>
  );
});

if (isDevelopment) {
  DropdownSubmenu.displayName = displayName;

  const triggerPropType = PropTypes.oneOf<PopperTrigger>([
    'click',
    'contextMenu',
    'custom',
    'focus',
    'hover',
  ]).isRequired;

  DropdownSubmenu.propTypes = {
    menus: PropTypes.node.isRequired,
    children: PropTypes.element.isRequired,
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
      'auto',
      'auto-start',
      'auto-end',
    ]),
    transitionClassName: PropTypes.string,
    offset: PropTypes.number,
    trigger: PropTypes.oneOfType([triggerPropType, PropTypes.arrayOf(triggerPropType)]),
    visible: PropTypes.bool,
    defaultVisible: PropTypes.bool,
    onVisibleChange: PropTypes.func,
    getPopupContainer: PropTypes.func,
  };
}

export default DropdownSubmenu;
