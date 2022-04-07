import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import { isProduction, isServer } from '@xl-vision/utils';
import { useConstantFn } from '@xl-vision/hooks';
import usePropChange from '../hooks/usePropChange';
import Popper, { PopperPlacement, PopperProps, PopperTrigger } from '../Popper';
import { styled } from '../styles';
import ThemeContext from '../ThemeProvider/ThemeContext';
import DropdownContext from './DropdownContext';

export interface DropdownProps
  extends Omit<PopperProps, 'popup' | 'arrow' | 'transitionClasses' | 'disablePopupEnter'> {
  children: React.ReactElement;
  menus: React.ReactNode;
  transitionClassName?: string;
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

// TODO [2022-05-01]: tab快捷键支持
const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>((props, ref) => {
  const {
    menus,
    children,
    placement = 'bottom',
    transitionClassName,
    offset = 12,
    trigger = 'hover',
    visible: visibleProp,
    defaultVisible = false,
    onVisibleChange,
    popupContainer,
    className,
    ...others
  } = props;

  const { clsPrefix } = React.useContext(ThemeContext);

  const submenuCloseHandlersRef = React.useRef<Array<() => void>>([]);

  const [visible, setVisible] = usePropChange(defaultVisible, visibleProp, onVisibleChange);

  const setVisibleWrapper = useConstantFn((newVisible: boolean) => {
    if (!newVisible) {
      submenuCloseHandlersRef.current.forEach((it) => it());
    }
    setVisible(newVisible);
  });

  React.useEffect(() => {
    if (!visible) {
      submenuCloseHandlersRef.current.forEach((it) => it());
    }
  }, [visible]);

  const rootClassName = `${clsPrefix}-dropdown`;

  const rootClasses = clsx(rootClassName, className);

  const memorizedValue = React.useMemo(() => {
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
      disablePopupEnter={false}
      visible={visible}
      // eslint-disable-next-line react/jsx-handler-names
      onVisibleChange={setVisible}
      trigger={trigger}
      placement={placement}
      popup={popup}
      offset={offset}
      popupContainer={popupContainer}
      transitionClasses={transitionClassName || rootClassName}
    >
      {children}
    </DropdownRoot>
  );
});

if (!isProduction) {
  Dropdown.displayName = displayName;

  const triggerPropType = PropTypes.oneOf<PopperTrigger>([
    'click',
    'contextMenu',
    'custom',
    'focus',
    'hover',
  ]).isRequired;

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
      'auto',
      'auto-start',
      'auto-end',
    ]),
    transitionClassName: PropTypes.string,
    className: PropTypes.string,
    offset: PropTypes.number,
    trigger: PropTypes.oneOfType([triggerPropType, PropTypes.arrayOf(triggerPropType)]),
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
