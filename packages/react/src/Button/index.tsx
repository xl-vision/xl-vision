import PropTypes from 'prop-types';
import React from 'react';
import { styled } from '../styles';
import { isDevelopment } from '../utils/env';

export type ButtonTheme = 'default' | 'primary' | 'error' | 'warning' | 'secondary';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  theme?: ButtonTheme;
}

const displayName = 'Button';

export type ButtonStyleProps = {
  theme: ButtonTheme;
};

const ButtonRoot = styled('button', {
  name: displayName,
  slot: 'Root',
})<ButtonStyleProps>(({ theme, styleProps }) => {
  const {} = theme;
  const {} = styleProps;
  return {};
});

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { theme = 'default', children, ...others } = props;
  return (
    <ButtonRoot {...others} ref={ref} styleProps={{ theme }}>
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
