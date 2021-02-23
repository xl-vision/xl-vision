import PropTypes from 'prop-types';
import React from 'react';
import BaseButton from '../BaseButton';
import { styled } from '../styles';
import { ThemeColors } from '../ThemeProvider/color/themeColor';
import { isDevelopment } from '../utils/env';

export type ButtonTheme = keyof ThemeColors | 'default';

export type ButtonSize = 'small' | 'middle' | 'large';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  theme?: ButtonTheme;
  disableElevation?: boolean;
  size?: ButtonSize;
}

const displayName = 'Button';

export type ButtonStyleProps = {
  theme: ButtonTheme;
  disableElevation: boolean;
  size: ButtonSize;
};

const ButtonRoot = styled(BaseButton, {
  name: displayName,
  slot: 'Root',
})<ButtonStyleProps>(({ theme, styleProps }) => {
  const {} = theme;
  const { theme: themeStyle, disableElevation } = styleProps;

  const backgroundColor =
    themeStyle === 'default' ? theme.color.grey[300] : theme.color.themes[themeStyle].color;

  return {
    transition: theme.transition.standard('all'),
    ...theme.typography.button,
    backgroundColor,
    color: theme.color.getContrast(backgroundColor).text.primary,
    padding: '6px 16px',
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: theme.color.applyState(backgroundColor, 'hover'),
    },
    ...(disableElevation &&
      {
        // ...theme.elevations(),
      }),
  };
});

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    theme = 'default',
    disableElevation = false,
    size = 'middle',
    disabled,
    children,
    ...others
  } = props;
  return (
    <ButtonRoot {...others} ref={ref} styleProps={{ theme, disableElevation, size }}>
      {children}
    </ButtonRoot>
  );
});

if (isDevelopment) {
  Button.displayName = displayName;

  Button.propTypes = {
    theme: PropTypes.oneOf<ButtonTheme>(['default', 'error', 'primary', 'secondary', 'warning']),
    children: PropTypes.node,
  };
}

export default Button;
