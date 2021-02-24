import { CSSObject } from '@xl-vision/styled-engine-types';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import BaseButton from '../BaseButton';
import { styled } from '../styles';
import { ThemeColors } from '../ThemeProvider/color/themeColor';
import ThemeContext from '../ThemeProvider/ThemeContext';
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
  disabled?: boolean;
};

const ButtonRoot = styled(BaseButton, {
  name: displayName,
  slot: 'Root',
})<ButtonStyleProps>(({ theme, styleProps }) => {
  const {} = theme;
  const { theme: themeStyle, disableElevation, disabled } = styleProps;

  const backgroundColor =
    themeStyle === 'default' ? theme.color.grey[300] : theme.color.themes[themeStyle].color;

  const baseColor = theme.color.getContrastText(backgroundColor);

  const styles: CSSObject = {
    transition: theme.transition.standard('all'),
    backgroundColor,
    color: baseColor.text.primary,
    padding: '6px 16px',
    borderRadius: '4px',
    ...theme.typography.button,
  };

  if (disabled) {
    styles.opacity = baseColor.action.disabled;
    styles.cursor = 'not-allowed';
  } else if (!disableElevation) {
    styles['&:hover'] = {
      backgroundColor: theme.color.applyState(backgroundColor, 'hover'),
      ...theme.elevations(4),
    };
    styles['&:hover'] = {
      backgroundColor: theme.color.applyState(backgroundColor, 'focus'),
      ...theme.elevations(8),
    };
  }

  return styles;
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

  const { clsPrefix } = React.useContext(ThemeContext);

  const baseClassName = `${clsPrefix}-button`;

  const rootClassName = `${baseClassName}__root`;

  const classes = clsx(
    rootClassName,
    `${rootClassName}--size-${size}`,
    `${rootClassName}--theme-${theme}`,
    {
      [`${rootClassName}--elevation`]: !disableElevation,
      [`${rootClassName}--disabled`]: disabled,
    },
  );

  return (
    <ButtonRoot
      {...others}
      ref={ref}
      className={classes}
      styleProps={{ theme, disableElevation, size, disabled }}
    >
      {children}
    </ButtonRoot>
  );
});

if (isDevelopment) {
  Button.displayName = displayName;

  Button.propTypes = {
    theme: PropTypes.oneOf<ButtonTheme>(['default', 'error', 'primary', 'secondary', 'warning']),
    disableElevation: PropTypes.bool,
    disabled: PropTypes.bool,
    size: PropTypes.oneOf<ButtonSize>(['large', 'middle', 'small']),
    children: PropTypes.node,
  };
}

export default Button;
