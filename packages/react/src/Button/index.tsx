import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import { LoadingOutlined } from '@xl-vision/icons';
import { keyframes, CSSObject } from '@xl-vision/styled-engine';
import { env } from '@xl-vision/utils';
import BaseButton, { BaseButtonProps } from '../BaseButton';
import { styled } from '../styles';
import { ThemeColors } from '../ThemeProvider/color/themeColor';
import CollapseTransition from '../CollapseTransition';
import { alpha } from '../utils/color';
import { ComponentSize, useTheme } from '../ThemeProvider';

export type ButtonColor = keyof ThemeColors | 'default';

export type ButtonVariant = 'contained' | 'outlined' | 'text';

export type ButtonProps = BaseButtonProps & {
  color?: ButtonColor;
  disableElevation?: boolean;
  size?: ComponentSize;
  prefixIcon?: React.ReactElement<React.SVGAttributes<SVGSVGElement>>;
  suffixIcon?: React.ReactElement<React.SVGAttributes<SVGSVGElement>>;
  variant?: ButtonVariant;
  long?: boolean;
  round?: boolean;
};

const displayName = 'Button';

export type ButtonStyleProps = {
  color: ButtonColor;
  disableElevation: boolean;
  size: ComponentSize;
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

const iconSize = 1.4;

const ButtonRoot = styled(BaseButton, {
  name: displayName,
  slot: 'Root',
})<ButtonStyleProps>(({ theme, styleProps }) => {
  const { color: themeColor, transition, typography, elevations, styleSize } = theme;

  const { info: buttonInfo, style: buttonStyle } = typography.button;

  const {
    color: colorStyle,
    disableElevation,
    disabled,
    loading,
    size,
    variant,
    long,
    round,
    icon,
  } = styleProps;

  const themeSize = styleSize[size];

  const baseFontSize = buttonInfo.size * themeSize.fontSize;

  const styles: CSSObject = {
    transition: transition.standard('all'),
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
    if (icon) {
      styles.borderRadius = '50%';
    } else {
      styles.borderRadius = themeSize.padding.y * 2 + buttonInfo.lineHeight * baseFontSize;
    }
  }

  if (long) {
    styles.width = '100%';
  }

  if (variant === 'text' || variant === 'outlined') {
    styles.backgroundColor = 'transparent';

    const color =
      colorStyle === 'default' ? themeColor.text.primary : themeColor.themes[colorStyle].color;
    styles.color = color;

    if (variant === 'outlined') {
      styles.border = `${themeSize.border}px solid ${alpha(color, 0.5)}`;
      // 保证高度一致
      padding = padding.map((it) => it - themeSize.border);
    }

    if (disabled || loading) {
      styles.opacity =
        colorStyle === 'default'
          ? themeColor.action.disabled
          : themeColor.themes[colorStyle].action.disabled;
    } else {
      styles['&:hover'] = {
        backgroundColor: alpha(color, themeColor.action.hover),
      };
      styles['&:focus'] = {
        backgroundColor: alpha(color, themeColor.action.focus),
      };
    }
  } else if (variant === 'contained') {
    // 特殊处理
    const backgroundColor =
      colorStyle === 'default' ? themeColor.background.paper : themeColor.themes[colorStyle].color;
    const baseColor = themeColor.getContrastColor(backgroundColor);
    styles.color = baseColor.text.primary;
    styles.backgroundColor = backgroundColor;

    if (disabled || loading) {
      styles.opacity = baseColor.action.disabled;
    } else {
      if (!disableElevation) {
        styles.boxShadow = elevations(2).boxShadow;
      }
      styles['&:hover'] = {
        backgroundColor: themeColor.applyState(backgroundColor, 'hover'),
        ...(!disableElevation && elevations(4)),
      };
      styles['&:focus'] = {
        backgroundColor: themeColor.applyState(backgroundColor, 'focus'),
        ...(!disableElevation && elevations(8)),
      };
    }
  }

  styles.padding = padding.map((it) => `${it}px`).join(' ');

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
    transition: transition.standard('width'),
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

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { clsPrefix, componentSize } = useTheme();

  const {
    color = 'default',
    disableElevation = false,
    size = componentSize,
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

  const [LoadingIcon, setLoadingIcon] = React.useState<React.ComponentType<any>>();

  const icon = !children;

  React.useEffect(() => {
    if (loading) {
      setLoadingIcon(DefaultLoadingIcon);
    } else if (prefixIcon) {
      setLoadingIcon(undefined);
    }
  }, [loading, prefixIcon]);

  const afterLoadingFinished = React.useCallback(() => {
    setLoadingIcon(undefined);
  }, []);

  const rootClassName = `${clsPrefix}-button`;

  const rootClasses = clsx(
    rootClassName,
    `${rootClassName}--size-${size}`,
    `${rootClassName}--color-${color}`,
    `${rootClassName}--variant-${variant}`,
    {
      [`${rootClassName}--elevation`]: !disableElevation && variant === 'contained',
      [`${rootClassName}--disabled`]: disabled,
      [`${rootClassName}--loading`]: loading,
      [`${rootClassName}--long`]: long,
      [`${rootClassName}--round`]: round,
      [`${rootClassName}--icon`]: icon,
    },
    className,
  );

  const prefixClassName = `${rootClassName}__prefix`;

  let prefix: React.ReactElement<any> | undefined;

  if (LoadingIcon) {
    prefix = (
      <ButtonPrefix styleProps={{ icon }} className={prefixClassName}>
        <LoadingIcon className={`${prefixClassName}--loading`} />
      </ButtonPrefix>
    );
    if (!prefixIcon) {
      prefix = (
        <CollapseTransition
          horizontal={true}
          transitionOnFirst={true}
          in={!!loading}
          afterLeave={afterLoadingFinished}
          transitionClasses={prefixClassName}
        >
          {prefix}
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

  const suffixClassName = `${rootClassName}__suffix`;

  const suffix = suffixIcon && (
    <ButtonSuffix styleProps={{ icon }} className={suffixClassName}>
      {suffixIcon}
    </ButtonSuffix>
  );

  return (
    <ButtonRoot
      {...others}
      ref={ref}
      className={rootClasses}
      loading={loading}
      disabled={disabled}
      styleProps={{
        color,
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
      {children && <span className={`${rootClassName}__inner`}>{children}</span>}
      {suffix}
    </ButtonRoot>
  );
});

if (!env.isProduction) {
  Button.displayName = displayName;

  Button.propTypes = {
    color: PropTypes.oneOf<ButtonColor>([
      'default',
      'error',
      'primary',
      'secondary',
      'warning',
      'info',
    ]),
    disableElevation: PropTypes.bool,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    long: PropTypes.bool,
    round: PropTypes.bool,
    size: PropTypes.oneOf<ComponentSize>(['large', 'middle', 'small']),
    children: PropTypes.node,
    prefixIcon: PropTypes.element,
    suffixIcon: PropTypes.element,
    variant: PropTypes.oneOf<ButtonVariant>(['contained', 'outlined', 'text']),
    className: PropTypes.string,
  };
}

export default Button;
