import { CSSObject } from '@xl-vision/styled-engine-types';
import React from 'react';
import BaseButton from '../BaseButton';
import useEventCallback from '../hooks/useEventCallback';
import { styled } from '../styles';
import { isDevelopment } from '../utils/env';
import DropdownItemContext from './DropdownItemContext';

export type DropdownItemProps = {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const displayName = 'DropdownItem';

const DropdownItemRoot = styled('li', {
  name: displayName,
  slot: 'Button',
})(() => {
  return {
    display: 'block',
    padding: 0,
    margin: 0,
  };
});

export type DropdownItemButtonStyleProps = {
  disabled?: boolean;
};

const DropdownItemButton = styled(BaseButton, {
  name: displayName,
  slot: 'Button',
})<DropdownItemButtonStyleProps>(({ theme, styleProps }) => {
  const { color, transition, typography } = theme;

  const { disabled } = styleProps;

  const styles: CSSObject = {
    padding: '5px 12px',
    transition: transition.standard('all'),
    color: color.text.primary,
    // 不设置会导致有间隙，原因未知
    width: '100%',
    textAlign: 'left',
    ...typography.body2,
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

const DropdownItem = React.forwardRef<HTMLLIElement, DropdownItemProps>((props, ref) => {
  const { children, onClick, disabled, ...others } = props;

  const { setVisible } = React.useContext(DropdownItemContext);

  const handleClick = useEventCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      return;
    }
    setVisible(false);
    onClick?.(e);
  });

  return (
    <DropdownItemRoot ref={ref} as='div'>
      <DropdownItemButton
        {...others}
        styleProps={{ disabled }}
        disabled={disabled}
        onClick={handleClick}
      >
        {children}
      </DropdownItemButton>
    </DropdownItemRoot>
  );
});

if (isDevelopment) {
  DropdownItem.displayName = displayName;
  DropdownItem.propTypes = {};
}

export default DropdownItem;
