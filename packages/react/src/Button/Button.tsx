import { LoadingOutlined } from '@xl-vision/icons';
import { keyframes, CSSObject } from '@xl-vision/styled-engine';
import { isProduction } from '@xl-vision/utils';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  ReactElement,
  SVGAttributes,
  forwardRef,
  useState,
  ComponentType,
  useEffect,
  useCallback,
} from 'react';
import BaseButton, { BaseButtonInstance, BaseButtonProps } from '../BaseButton';
import CollapseTransition from '../CollapseTransition';
import { styled } from '../styles';
import { SizeVariant, ThemeVariant, useTheme } from '../ThemeProvider';

export type ButtonColor = ThemeVariant | 'default';

export type ButtonVariant = 'contained' | 'outlined' | 'text';

export type ButtonInstance = BaseButtonInstance;

export type ButtonProps = BaseButtonProps & {
  color?: ButtonColor;
  enableElevation?: boolean;
  size?: SizeVariant;
  prefixIcon?: ReactElement<SVGAttributes<SVGSVGElement>>;
  suffixIcon?: ReactElement<SVGAttributes<SVGSVGElement>>;
  variant?: ButtonVariant;
  long?: boolean;
  round?: boolean;
};

const displayName = 'Button';

export type ButtonStyleProps = {
  color: ButtonColor;
  enableElevation: boolean;
  icon: boolean;
  size: SizeVariant;
  variant: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  long?: boolean;
  round?: boolean;
};

export type ButtonPrefixStyleProps = {
  icon: boolean;
};

export type ButtonSuffixStyleProps = ButtonPrefixStyleProps;

const iconSize = 1.4;

const ButtonRoot = styled(BaseButton, {
  name: displayName,
  slot: 'Root',
})<ButtonStyleProps>(({ theme, styleProps }) => {
  const { colors, transitions, typography, elevations, sizes } = theme;

  const { info: buttonInfo, style: buttonStyle } = typography.button;

  const {
    color: colorStyle,
    enableElevation,
    disabled,
    loading,
    size,
    variant,
    long,
    round,
    icon,
  } = styleProps;

  const themeSize = sizes[size];

  const baseFontSize = buttonInfo.size * themeSize.fontSize;

  const styles: CSSObject = {
    transition: transitions.standard('all'),
    borderRadius: themeSize.borderRadius,
    minWidth: icon ? '' : '64px',
    ...buttonStyle,
    fontSize: typography.pxToRem(baseFontSize),
  };

  if (icon) {
    styles.lineHeight = 0;
  }

  const buttonHeight = themeSize.padding.y * 2 + buttonInfo.lineHeight * baseFontSize;

  const iconHeight = baseFontSize * iconSize;

  let padding = icon
    ? [(buttonHeight - iconHeight) / 2]
    : [themeSize.padding.y, themeSize.padding.x];

  if (round) {
    styles.borderRadius = icon
      ? '50%'
      : themeSize.padding.y * 2 + buttonInfo.lineHeight * baseFontSize;
  }

  if (long) {
    styles.width = '100%';
  }

  if (variant === 'outlined' || colorStyle === 'default') {
    // 保证高度一致
    padding = padding.map((it) => it - themeSize.border);
  }

  const isContained = variant === 'contained';

  styles.padding = padding.map((it) => `${it}px`).join(' ');

  if (disabled || loading) {
    styles.opacity = colors.opacity.disabled;
  } else if (isContained) {
    if (enableElevation) {
      styles.boxShadow = elevations[1];
    }
    styles['&:hover'] = {
      ...(enableElevation && {
        boxShadow: elevations[2],
      }),
    };
    styles['&:focus'] = {
      ...(enableElevation && {
        boxShadow: elevations[3],
      }),
    };
  }

  if (colorStyle === 'default') {
    styles.color = colors.text.primary;

    if (!loading && !disabled) {
      styles['&:hover'] = {
        ...(styles['&:hover'] as object),
        color: colors.themes.primary.foreground.hover,
      };

      styles['&:focus'] = {
        ...(styles['&:focus'] as object),
        color: colors.themes.primary.foreground.focus,
      };
    }

    if (isContained || variant === 'outlined') {
      styles.border = `${themeSize.border}px solid ${colors.divider.primary}`;

      if (!loading && !disabled) {
        styles['&:hover'] = {
          ...(styles['&:hover'] as object),
          borderColor: colors.themes.primary.divider.hover,
        };

        styles['&:focus'] = {
          ...(styles['&:focus'] as object),
          borderColor: colors.themes.primary.divider.focus,
        };
      }
    }

    if (isContained || variant === 'text') {
      styles['&:hover'] = {
        ...(styles['&:hover'] as object),
        backgroundColor: colors.themes.primary.background.hover,
      };
      styles['&:focus'] = {
        ...(styles['&:focus'] as object),
        backgroundColor: colors.themes.primary.background.focus,
      };
    }

    if (isContained) {
      styles.backgroundColor = colors.background.paper;
    }

    return styles;
  }

  if (isContained) {
    styles.color = colors.themes[colorStyle].text.primary;
    styles.backgroundColor = colors.themes[colorStyle].foreground.default;

    if (!disabled && !loading) {
      styles['&:hover'] = {
        ...(styles['&:hover'] as object),
        backgroundColor: colors.themes[colorStyle].foreground.hover,
      };
      styles['&:focus'] = {
        ...(styles['&:focus'] as object),
        backgroundColor: colors.themes[colorStyle].foreground.focus,
      };
    }

    return styles;
  }

  styles.backgroundColor = 'transparent';

  styles.color = colors.themes[colorStyle].foreground.default;

  if (!disabled && !loading) {
    styles['&:hover'] = {
      ...(styles['&:hover'] as object),
      backgroundColor: colors.themes[colorStyle].background.hover,
    };
    styles['&:focus'] = {
      ...(styles['&:focus'] as object),
      backgroundColor: colors.themes[colorStyle].background.focus,
    };
  }

  if (variant === 'outlined') {
    styles.border = `${themeSize.border}px solid ${colors.themes[colorStyle].divider.default}`;

    if (!disabled && !loading) {
      styles['&:hover'] = {
        ...(styles['&:hover'] as object),
        borderColor: colors.themes[colorStyle].divider.hover,
      };
      styles['&:focus'] = {
        ...(styles['&:focus'] as object),
        borderColor: colors.themes[colorStyle].divider.focus,
      };
    }
  }

  return styles;
});

const ButtonPrefix = styled('span', {
  name: displayName,
  slot: 'Prefix',
})<ButtonPrefixStyleProps>(({ theme, styleProps }) => {
  const { transitions } = theme;
  const { icon } = styleProps;

  const styles: CSSObject = {
    display: 'inline-block',
    transition: transitions.standard('width'),
    padding: 0,
    lineHeight: 0,
    fontSize: `${iconSize}em`,
    verticalAlign: 'middle',
    svg: {
      lineHeight: 1,
      verticalAlign: 'middle',
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
    transform: rotate(360deg);
  }
`;

// This `styled()` function invokes keyframes. `styled-components` only supports keyframes
// in string templates. Do not convert these styles in JS object as it will break.
const DefaultLoadingIcon = styled(LoadingOutlined, {
  name: displayName,
  slot: 'LoadingIcon',
})`
  animation: ${loadingKeyframes} 1s linear infinite;
`;

const Button = forwardRef<ButtonInstance, ButtonProps>((props, ref) => {
  const { clsPrefix, sizeVariant } = useTheme();

  const {
    color = 'default',
    enableElevation = false,
    size = sizeVariant,
    disabled,
    loading,
    prefixIcon,
    suffixIcon,
    children,
    variant = 'contained',
    long,
    round,
    className,
    ...others
  } = props;

  const [LoadingIcon, setLoadingIcon] = useState<ComponentType<object>>();

  const icon = !children;

  useEffect(() => {
    if (loading) {
      setLoadingIcon(DefaultLoadingIcon);
    } else if (prefixIcon) {
      setLoadingIcon(undefined);
    }
  }, [loading, prefixIcon]);

  const handleLoadingFinished = useCallback(() => {
    setLoadingIcon(undefined);
  }, []);

  const rootClassName = `${clsPrefix}-button`;

  const rootClasses = clsx(
    `${rootClassName}--size-${size}`,
    `${rootClassName}--color-${color}`,
    `${rootClassName}--variant-${variant}`,
    {
      [`${rootClassName}--elevation`]: enableElevation && variant === 'contained',
      [`${rootClassName}--disabled`]: disabled,
      [`${rootClassName}--loading`]: loading,
      [`${rootClassName}--long`]: long,
      [`${rootClassName}--round`]: round,
      [`${rootClassName}--icon`]: icon,
    },
    className,
  );

  const prefixClassName = `${rootClassName}__prefix`;

  let prefix: ReactElement | undefined;

  if (LoadingIcon) {
    prefix = (
      <ButtonPrefix styleProps={{ icon }}>
        <LoadingIcon />
      </ButtonPrefix>
    );
    if (!prefixIcon) {
      prefix = (
        <CollapseTransition
          horizontal={true}
          in={!!loading}
          transitionClassName={prefixClassName}
          transitionOnFirst={true}
          onExited={handleLoadingFinished}
        >
          {prefix}
        </CollapseTransition>
      );
    }
  } else if (prefixIcon) {
    prefix = <ButtonPrefix styleProps={{ icon }}>{prefixIcon}</ButtonPrefix>;
  }

  const suffix = suffixIcon && <ButtonSuffix styleProps={{ icon }}>{suffixIcon}</ButtonSuffix>;

  return (
    <ButtonRoot
      {...others}
      className={rootClasses}
      disabled={disabled}
      loading={loading}
      ref={ref}
      styleProps={{
        color,
        enableElevation,
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
      {children && <span className={`${rootClassName}__inner`}>{children}</span>}
      {suffix}
    </ButtonRoot>
  );
});

if (!isProduction) {
  Button.displayName = displayName;

  Button.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    color: PropTypes.oneOf<ButtonColor>([
      'default',
      'error',
      'primary',
      'warning',
      'info',
      'success',
    ]),
    disabled: PropTypes.bool,
    enableElevation: PropTypes.bool,
    loading: PropTypes.bool,
    long: PropTypes.bool,
    prefixIcon: PropTypes.element,
    round: PropTypes.bool,
    size: PropTypes.oneOf<SizeVariant>(['large', 'middle', 'small']),
    suffixIcon: PropTypes.element,
    variant: PropTypes.oneOf<ButtonVariant>(['contained', 'outlined', 'text']),
  };
}

export default Button;
