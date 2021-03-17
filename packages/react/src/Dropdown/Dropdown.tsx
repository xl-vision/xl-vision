import clsx from 'clsx';
import React from 'react';
import useEventCallback from '../hooks/useEventCallback';
import Popper, { PopperProps } from '../Popper';
import { styled } from '../styles';
import ThemeContext from '../ThemeProvider/ThemeContext';
import { isDevelopment } from '../utils/env';
import DropdownContext from './DropdownContext';
import DropdownItemContext from './DropdownItemContext';

export interface DropdownProps
  extends Omit<PopperProps, 'popup' | 'arrow' | 'transitionClasses' | 'disablePopupEnter'> {
  children: React.ReactElement;
  menus: React.ReactElement;
  transitionClassName?: string;
}

const displayName = 'Dropdown';

const DropdownRoot = styled(Popper, {
  name: displayName,
  slot: 'Root',
})(({ theme }) => {
  const { clsPrefix, transition } = theme;

  return {
    [`.${clsPrefix}-dropdown-slide`]: {
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

const DropdownPopup = styled('ul', {
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

const DropdownArrow = styled('div', {
  name: displayName,
  slot: 'Arrow',
})(({ theme }) => {
  const { color } = theme;
  const bgColor = color.background.paper;

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

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>((props, ref) => {
  const {
    menus,
    children,
    placement = 'bottom',
    transitionClassName,
    offset = 12,
    trigger = 'click',
    visible: visibleProp,
    defaultVisible = false,
    onVisibleChange,
    getPopupContainer = defaultGetPopupContainer,
    ...others
  } = props;

  const { clsPrefix } = React.useContext(ThemeContext);
  const { childrenCloseHandlers } = React.useContext(DropdownContext);
  const closeHandlersRef = React.useRef<Array<() => void>>([]);

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
        closeHandlersRef.current.forEach((it) => it());
      }
    }
    onVisibleChange?.(v);
  });

  React.useEffect(() => {
    if (visibleProp !== undefined) {
      setVisible(visibleProp);
      if (!visibleProp) {
        closeHandlersRef.current.forEach((it) => it());
      }
    }
  }, [visibleProp]);

  React.useEffect(() => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const closeHandler = () => {
      handleVisibleChange(false);
    };
    childrenCloseHandlers.push(closeHandler);

    return () => {
      childrenCloseHandlers.splice(childrenCloseHandlers.indexOf(closeHandler), 1);
    };
  }, [handleVisibleChange, childrenCloseHandlers]);

  const rootClassName = `${clsPrefix}-dropdown`;
  const popup = (
    <DropdownPopup>
      <DropdownItemContext.Provider value={{ setVisible }}>{menus}</DropdownItemContext.Provider>
    </DropdownPopup>
  );

  const arrow = <DropdownArrow className={`${rootClassName}__arrow`} />;

  return (
    <DropdownContext.Provider value={{ childrenCloseHandlers: closeHandlersRef.current }}>
      <DropdownRoot
        {...others}
        ref={ref}
        disablePopupEnter={false}
        visible={visible}
        onVisibleChange={handleVisibleChange}
        trigger={trigger}
        arrow={arrow}
        placement={placement}
        popup={popup}
        offset={offset}
        getPopupContainer={getPopupContainer}
        transitionClasses={clsx(`${rootClassName}-slide`, transitionClassName)}
      >
        {children}
      </DropdownRoot>
    </DropdownContext.Provider>
  );
});

if (isDevelopment) {
  Dropdown.displayName = displayName;
  Dropdown.propTypes = {};
}

export default Dropdown;
