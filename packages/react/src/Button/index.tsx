import { CSSObject } from '@xl-vision/styled-engine-types';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import LoopFilled from '@xl-vision/icons/LoopFilled';
import { keyframes } from '@xl-vision/styled-engine';
import BaseButton, { BaseButtonProps } from '../BaseButton';
import Icon from '../Icon';
import { styled } from '../styles';
import { ThemeColors } from '../ThemeProvider/color/themeColor';
import ThemeContext from '../ThemeProvider/ThemeContext';
import { isDevelopment } from '../utils/env';
import CollapseTransition from '../CollapseTransition';
import { alpha } from '../utils/color';

export type ButtonTheme = keyof ThemeColors | 'default';

export type ButtonSize = 'small' | 'middle' | 'large';

export type ButtonVariant = 'contained' | 'outlined' | 'text';

export type ButtonProps = BaseButtonProps & {
  theme?: ButtonTheme;
  disableElevation?: boolean;
  size?: ButtonSize;
  loading?: boolean;
  prefixIcon?: React.ReactElement<React.SVGAttributes<SVGSVGElement>>;
  suffixIcon?: React.ReactElement<React.SVGAttributes<SVGSVGElement>>;
  variant?: ButtonVariant;
  long?: boolean;
  round?: boolean;
};

const displayName = 'Button';

export type ButtonStyleProps = {
  theme: ButtonTheme;
  disableElevation: boolean;
  size: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  variant: ButtonVariant;
  long?: boolean;
  round?: boolean;
  icon: boolean;
};

export type ButtonPrefixStyleProps = {
  icon: boolean;
};

export type ButtonSuffixStyleProps = ButtonPrefixStyleProps;

const ButtonRoot = styled(BaseButton, {
  name: displayName,
  slot: 'Root',
})<ButtonStyleProps>(({ theme, styleProps }) => {
  const { color: colorTheme, transition, typography, elevations } = theme;
  const {
    theme: themeStyle,
    disableElevation,
    disabled,
    loading,
    size,
    variant,
    long,
    round,
    icon,
  } = styleProps;

  const styles: CSSObject = {
    transition: transition.standard('all'),
    padding: '6px 16px',
    borderRadius: '4px',
    minWidth: icon ? '' : '64px',
    ...typography.button,
    // https://github.com/facebook/react/issues/4492#issuecomment-426356566
    svg: {
      pointerEvents: 'none',
    },
  };

  if (icon) {
    styles.padding = '8.2px';
    styles.lineHeight = 0;
  }

  if (round) {
    styles.borderRadius = 6 * 2 + 1.75 * 14;
  }

  if (size === 'small') {
    styles.padding = icon ? '6.5px' : '4px 10px';
    styles.fontSize = typography.pxToRem(13);
    if (round) {
      styles.borderRadius = 4 * 2 + 1.75 * 14;
    }
  } else if (size === 'large') {
    styles.padding = icon ? '10.5px' : '8px 22px';
    styles.fontSize = typography.pxToRem(15);
    if (round) {
      styles.borderRadius = 8 * 2 + 1.75 * 14;
    }
  }

  if (icon && round) {
    styles.borderRadius = '50%';
  }

  if (long) {
    styles.width = '100%';
  }

  if (variant === 'text' || variant === 'outlined') {
    styles.backgroundColor = 'transparent';

    const color =
      themeStyle === 'default' ? colorTheme.text.primary : colorTheme.themes[themeStyle].color;
    styles.color = color;

    if (variant === 'outlined') {
      styles.border = `1px solid ${alpha(color, 0.5)}`;
    }

    if (disabled || loading) {
      styles.opacity =
        themeStyle === 'default'
          ? colorTheme.action.disabled
          : colorTheme.themes[themeStyle].action.disabled;
    } else {
      styles['&:hover'] = {
        backgroundColor: alpha(color, colorTheme.action.hover),
      };
      styles['&:focus'] = {
        backgroundColor: alpha(color, colorTheme.action.focus),
      };
    }
  } else if (variant === 'contained') {
    const backgroundColor =
      themeStyle === 'default' ? colorTheme.grey[300] : colorTheme.themes[themeStyle].color;
    const baseColor = colorTheme.getContrastText(backgroundColor);
    styles.color = baseColor.text.primary;
    styles.backgroundColor = backgroundColor;
    if (disabled || loading) {
      styles.opacity = baseColor.action.disabled;
    } else {
      styles['&:hover'] = {
        backgroundColor: colorTheme.applyState(backgroundColor, 'hover'),
        ...(!disableElevation && elevations(4)),
      };
      styles['&:focus'] = {
        backgroundColor: colorTheme.applyState(backgroundColor, 'focus'),
        ...(!disableElevation && elevations(8)),
      };
    }
  }

  return styles;
});

const ButtonPrefix = styled('span', {
  name: displayName,
  slot: 'Prefix',
})<ButtonPrefixStyleProps>(({ theme, styleProps }) => {
  const { transition } = theme;
  const { icon } = styleProps;

  const styles: CSSObject = {
    display: 'inline-block',
    verticalAlign: 'middle',
    transition: transition.standard('width'),
    padding: 0,
    lineHeight: 0,
    fontSize: '1.4em',
    svg: {
      lineHeight: 1,
    },
  };

  if (!icon) {
    styles.marginLeft = '-2px';
    styles.marginRight = '2px';
  }

  return styles;
});

const ButtonSuffix = styled(ButtonPrefix, {
  name: displayName,
  slot: 'Suffix',
})<ButtonPrefixStyleProps>(({ styleProps }) => {
  const { icon } = styleProps;

  if (!icon) {
    return {
      marginLeft: '2px',
      marginRight: '-2px',
    };
  }
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
    variant = 'contained',
    long,
    round,
    ...others
  } = props;

  const { clsPrefix } = React.useContext(ThemeContext);

  const [loadingIcon, setLoadingIcon] = React.useState<React.ReactElement>();

  const icon = !children;

  React.useEffect(() => {
    if (loading) {
      setLoadingIcon(<LoopFilled />);
    } else if (prefixIcon) {
      setLoadingIcon(undefined);
    }
  }, [loading, prefixIcon]);

  const afterLoadingFinished = React.useCallback(() => {
    setLoadingIcon(undefined);
  }, []);

  const baseClassName = `${clsPrefix}-button`;

  const rootClassName = `${baseClassName}__root`;

  const classes = clsx(
    rootClassName,
    `${rootClassName}--size-${size}`,
    `${rootClassName}--theme-${theme}`,
    `${rootClassName}--variant-${variant}`,
    {
      [`${rootClassName}--elevation`]: !disableElevation && variant === 'contained',
      [`${rootClassName}--disabled`]: disabled,
      [`${rootClassName}--loading`]: loading,
      [`${rootClassName}--long`]: long,
      [`${rootClassName}--round`]: round,
      [`${rootClassName}--icon`]: icon,
    },
  );

  const prefixClassName = `${baseClassName}__prefix`;

  let prefix: React.ReactElement<any> | undefined;

  if (loadingIcon) {
    if (prefixIcon) {
      prefix = (
        <ButtonPrefix styleProps={{ icon }} className={prefixClassName}>
          <Loading className={`${prefixClassName}--loading`}>{loadingIcon}</Loading>
        </ButtonPrefix>
      );
    } else {
      prefix = (
        <CollapseTransition
          horizontal={true}
          transitionOnFirst={true}
          in={!!loading}
          afterLeave={afterLoadingFinished}
          transitionClasses={prefixClassName}
        >
          <ButtonPrefix styleProps={{ icon }} className={prefixClassName}>
            <Loading className={`${prefixClassName}--loading`}>{loadingIcon}</Loading>
          </ButtonPrefix>
        </CollapseTransition>
      );
    }
  } else if (prefixIcon) {
    prefix = (
      <ButtonPrefix styleProps={{ icon }} className={prefixClassName}>
        {prefixIcon}
      </ButtonPrefix>
    );
  }

  const suffixClassName = `${baseClassName}__suffix`;

  const suffix = suffixIcon && (
    <ButtonSuffix styleProps={{ icon }} className={suffixClassName}>
      {suffixIcon}
    </ButtonSuffix>
  );

  return (
    <ButtonRoot
      {...others}
      ref={ref}
      className={classes}
      loading={loading}
      disabled={disabled}
      styleProps={{
        theme,
        disableElevation,
        size,
        disabled,
        loading,
        variant,
        long,
        round,
        icon,
      }}
    >
      {prefix}
      {children && <span>{children}</span>}
      {suffix}
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
    long: PropTypes.bool,
    round: PropTypes.bool,
    size: PropTypes.oneOf<ButtonSize>(['large', 'middle', 'small']),
    children: PropTypes.node,
    prefixIcon: PropTypes.element,
    suffixIcon: PropTypes.element,
    variant: PropTypes.oneOf<ButtonVariant>(['contained', 'outlined', 'text']),
  };
}

export default Button;
