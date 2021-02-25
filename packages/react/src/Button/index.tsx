import { CSSObject } from '@xl-vision/styled-engine-types';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import LoopFilled from '@xl-vision/icons/LoopFilled';
import { keyframes } from '@xl-vision/styled-engine';
import BaseButton from '../BaseButton';
import Icon from '../Icon';
import { styled } from '../styles';
import { ThemeColors } from '../ThemeProvider/color/themeColor';
import ThemeContext from '../ThemeProvider/ThemeContext';
import { isDevelopment } from '../utils/env';
import CollapseTransition from '../CollapseTransition';

export type ButtonTheme = keyof ThemeColors | 'default';

export type ButtonSize = 'small' | 'middle' | 'large';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  theme?: ButtonTheme;
  disableElevation?: boolean;
  size?: ButtonSize;
  loading?: boolean;
  prefixIcon?: React.ReactElement<React.SVGAttributes<SVGSVGElement>>;
  suffixIcon?: React.ReactElement<React.SVGAttributes<SVGSVGElement>>;
}

const displayName = 'Button';

export type ButtonStyleProps = {
  theme: ButtonTheme;
  disableElevation: boolean;
  size: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
};

const ButtonRoot = styled(BaseButton, {
  name: displayName,
  slot: 'Root',
})<ButtonStyleProps>(({ theme, styleProps }) => {
  const { color, transition, typography, elevations } = theme;
  const { theme: themeStyle, disableElevation, disabled, loading } = styleProps;

  const backgroundColor =
    themeStyle === 'default' ? color.grey[300] : color.themes[themeStyle].color;

  const baseColor = color.getContrastText(backgroundColor);

  const styles: CSSObject = {
    transition: transition.standard('all'),
    backgroundColor,
    color: baseColor.text.primary,
    padding: '6px 16px',
    borderRadius: '4px',
    minWidth: '64px',
    ...typography.button,
  };

  if (disabled || loading) {
    styles.opacity = baseColor.action.disabled;
  } else if (!disableElevation && !loading) {
    styles['&:hover'] = {
      backgroundColor: color.applyState(backgroundColor, 'hover'),
      ...elevations(4),
    };
    styles['&:hover'] = {
      backgroundColor: color.applyState(backgroundColor, 'focus'),
      ...elevations(8),
    };
  }

  return styles;
});

const ButtonPrefix = styled('span', {
  name: displayName,
  slot: 'Prefix',
})(({ theme }) => {
  const { typography, clsPrefix, transition } = theme;
  return {
    display: 'inline-block',
    verticalAlign: 'middle',
    marginLeft: '-2px',
    marginRight: '2px',
    fontSize: typography.pxToRem(18),
    lineHeight: 1,

    [`.${clsPrefix}-button__prefix--loading`]: {
      transition: transition.standard('width'),
    },
  };
});

const loadingKeyframes = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(180deg);
  }
`;

// This `styled()` function invokes keyframes. `styled-components` only supports keyframes
// in string templates. Do not convert these styles in JS object as it will break.
const Loading = styled(Icon, {
  name: displayName,
  slot: 'Loading',
})`
  animation: ${loadingKeyframes} ${({ theme }) => theme.transition.durations.standard} linear
    infinite;
`;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    theme = 'default',
    disableElevation = false,
    size = 'middle',
    disabled,
    loading,
    prefixIcon,
    suffixIcon,
    children,
    ...others
  } = props;

  const { clsPrefix } = React.useContext(ThemeContext);

  const [loadingIcon, setLoadingIcon] = React.useState<React.ReactElement>();

  React.useEffect(() => {
    if (loading) {
      setLoadingIcon(<LoopFilled />);
    }
  }, [loading]);

  const afterLoadingFinished = React.useCallback(() => {
    setLoadingIcon(undefined);
  }, []);

  const baseClassName = `${clsPrefix}-button`;

  const rootClassName = `${baseClassName}__root`;

  const classes = clsx(
    rootClassName,
    `${rootClassName}--size-${size}`,
    `${rootClassName}--theme-${theme}`,
    {
      [`${rootClassName}--elevation`]: !disableElevation,
      [`${rootClassName}--disabled`]: disabled,
      [`${rootClassName}--loading`]: loading,
    },
  );

  const prefixClassName = `${baseClassName}__prefix`;

  const prefix = loadingIcon ? (
    <CollapseTransition
      horizontal={true}
      transitionOnFirst={true}
      in={!!loading}
      afterLeave={afterLoadingFinished}
    >
      <ButtonPrefix className={prefixClassName}>
        <Loading className={`${prefixClassName}--loading`}>{loadingIcon}</Loading>
      </ButtonPrefix>
    </CollapseTransition>
  ) : prefixIcon ? (
    <ButtonPrefix className={prefixClassName}>{prefixIcon}</ButtonPrefix>
  ) : null;

  return (
    <ButtonRoot
      {...others}
      ref={ref}
      className={classes}
      loading={loading}
      disabled={disabled}
      styleProps={{ theme, disableElevation, size, disabled, loading }}
    >
      {prefix}
      <span>{children}</span>
    </ButtonRoot>
  );
});

if (isDevelopment) {
  Button.displayName = displayName;

  Button.propTypes = {
    theme: PropTypes.oneOf<ButtonTheme>(['default', 'error', 'primary', 'secondary', 'warning']),
    disableElevation: PropTypes.bool,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    size: PropTypes.oneOf<ButtonSize>(['large', 'middle', 'small']),
    children: PropTypes.node,
    prefixIcon: PropTypes.element,
    suffixIcon: PropTypes.element,
  };
}

export default Button;
