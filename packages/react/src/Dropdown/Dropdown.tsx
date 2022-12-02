import clsx from 'clsx';
import PropTypes from 'prop-types';
import { isProduction, isServer } from '@xl-vision/utils';
import { useConstantFn } from '@xl-vision/hooks';
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
    visible: visibleProp,
    defaultVisible = false,
    onVisibleChange,
    popupContainer,
    className,
    ...others
  } = props;

  const { clsPrefix } = useContext(ThemeContext);

  const submenuCloseHandlersRef = useRef<Array<() => void>>([]);

  const [visible, setVisible] = usePropChange(defaultVisible, visibleProp, onVisibleChange);

  const setVisibleWrapper = useConstantFn((newVisible: boolean) => {
    if (!newVisible) {
      submenuCloseHandlersRef.current.forEach((it) => it());
    }
    setVisible(newVisible);
  });

  useEffect(() => {
    if (!visible) {
      submenuCloseHandlersRef.current.forEach((it) => it());
    }
  }, [visible]);

  const rootClassName = `${clsPrefix}-dropdown`;

  const rootClasses = clsx(rootClassName, className);

  const memorizedValue = useMemo(() => {
    return {
      submenuCloseHandlers: submenuCloseHandlersRef.current,
      setVisible: setVisibleWrapper,
    };
  }, [setVisibleWrapper]);

  const popup = (
    <DropdownPopup className={`${rootClassName}__popup`}>
      <DropdownContext.Provider value={memorizedValue}>{menus}</DropdownContext.Provider>
    </DropdownPopup>
  );

  return (
    <DropdownRoot
      {...others}
      ref={ref}
      className={rootClasses}
      visible={visible}
      // eslint-disable-next-line react/jsx-handler-names
      onVisibleChange={setVisible}
      placement={placement}
      popup={popup}
      offset={offset}
      popupContainer={popupContainer}
      transitionClassName={transitionClassName || rootClassName}
    >
      {children}
    </DropdownRoot>
  );
});

if (!isProduction) {
  Dropdown.displayName = displayName;

  Dropdown.propTypes = {
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
    ]),
    transitionClassName: PropTypes.string,
    className: PropTypes.string,
    offset: PropTypes.number,

    visible: PropTypes.bool,
    defaultVisible: PropTypes.bool,
    onVisibleChange: PropTypes.func,
    popupContainer: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
      isServer ? PropTypes.any : PropTypes.instanceOf(Element),
    ]),
  };
}

export default Dropdown;
