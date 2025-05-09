import { LoadingOutlined } from '@xl-vision/icons';
import { css, keyframes } from '@xl-vision/styled-engine';
import { isProduction } from '@xl-vision/utils';
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
import memoStyled, { ThemeStyleVariant } from '../memoStyled';
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
  elevation: boolean;
  icon: boolean;
  size: SizeVariant;
  variant: ButtonVariant;
  disabled: boolean;
  loading: boolean;
  long: boolean;
  round: boolean;
};

export type ButtonPrefixStyleProps = {
  icon: boolean;
};

export type ButtonSuffixStyleProps = ButtonPrefixStyleProps;

const iconSize = 1.4;

const ButtonRoot = memoStyled(BaseButton, {
  name: displayName,
  slot: 'Root',
})<ButtonStyleProps>(({ theme }) => {
  const { colors, transitions, typography, elevations, sizes } = theme;

  const { info: buttonInfo, style: buttonStyle } = typography.button;

  return {
    transition: transitions.standard('all'),
    ...buttonStyle,
    backgroundColor: 'transparent',
    variants: [
      {
        props: {
          icon: false,
        },
        style: {
          minWidth: 64,
        },
      },
      {
        props: {
          icon: true,
        },
        style: {
          lineHeight: 0,
        },
      },
      {
        props: {
          long: true,
        },
        style: {
          width: '100%',
        },
      },
      ...Object.keys(sizes).flatMap<ThemeStyleVariant<ButtonStyleProps>>((k) => {
        const size = k as SizeVariant;
        const themeSize = sizes[size];
        const baseFontSize = buttonInfo.size * themeSize.fontSize;

        const buttonHeight = themeSize.padding.y * 2 + buttonInfo.lineHeight * baseFontSize;

        const iconHeight = baseFontSize * iconSize;

        const padding = [themeSize.padding.y, themeSize.padding.x];
        const iconPadding = [(buttonHeight - iconHeight) / 2];

        return [
          {
            props: {
              size,
            },
            style: {
              borderRadius: themeSize.borderRadius,
              fontSize: typography.pxToRem(baseFontSize),
              padding: padding.map((it) => `${it}px`).join(' '),
            },
            variants: [
              {
                props: {
                  round: true,
                },
                style: {
                  borderRadius: themeSize.padding.y * 2 + buttonInfo.lineHeight * baseFontSize,
                },
              },
              {
                props: {
                  icon: true,
                },
                style: {
                  padding: iconPadding.map((it) => `${it}px`).join(' '),
                },
              },
              {
                props: {
                  variant: 'outlined',
                },
                style: {
                  border: `${themeSize.border}px solid transparent`,
                },
              },
              {
                props: [
                  {
                    variant: 'outlined',
                  },
                  {
                    color: 'default',
                  },
                ],
                style: {
                  padding: padding
                    .map((it) => it - themeSize.border)
                    .map((it) => `${it}px`)
                    .join(' '),
                },
              },
            ],
          },
        ];
      }),
      {
        props: {
          round: true,
          icon: true,
        },
        style: {
          borderRadius: '50%',
        },
      },
      {
        props: [
          {
            disabled: true,
          },
          {
            loading: true,
          },
        ],
        style: {
          opacity: colors.opacity.disabled,
        },
      },
      {
        props: {
          variant: 'contained',
          elevation: true,
          disabled: false,
          loading: false,
        },

        style: {
          boxShadow: elevations[1],
          '&:hover': {
            boxShadow: elevations[2],
          },
          '&:focus': {
            boxShadow: elevations[3],
          },
        },
      },
      ...Object.keys(colors.themes).flatMap<ThemeStyleVariant<ButtonStyleProps>>((k) => {
        const colorKey = k as ThemeVariant;
        const color = colors.themes[colorKey];
        return [
          {
            props: {
              color: colorKey,
            },
            style: {
              color: color.foreground.default,
            },
            variants: [
              {
                props: {
                  disabled: false,
                  loading: false,
                },

                style: {
                  '&:hover': {
                    backgroundColor: color.background.hover,
                  },
                  '&:focus': {
                    backgroundColor: color.background.focus,
                  },
                },
              },
              {
                props: {
                  variant: 'contained',
                },
                style: {
                  color: color.text.primary,
                  backgroundColor: color.foreground.default,
                },
                variants: [
                  {
                    props: {
                      disabled: false,
                      loading: false,
                    },

                    style: {
                      '&:hover': {
                        backgroundColor: color.foreground.hover,
                      },
                      '&:focus': {
                        backgroundColor: color.foreground.focus,
                      },
                    },
                  },
                ],
              },
              {
                props: {
                  variant: 'outlined',
                },
                style: {
                  borderColor: color.divider.default,
                },
                variants: [
                  {
                    props: {
                      variant: 'outlined',
                      loading: false,
                      disabled: false,
                    },
                    style: {
                      '&:hover': {
                        borderColor: color.divider.hover,
                      },
                      '&:focus': {
                        borderColor: color.divider.focus,
                      },
                    },
                  },
                ],
              },
            ],
          },
        ];
      }),
      {
        props: {
          color: 'default',
        },
        style: {
          color: colors.text.primary,
        },
        variants: [
          {
            props: {
              disabled: false,
              loading: false,
            },

            style: {
              '&:hover': {
                backgroundColor: colors.background.hover,
              },
              '&:focus': {
                backgroundColor: colors.background.focus,
              },
            },
          },
          {
            props: {
              variant: 'contained',
            },
            style: {
              color: colors.inverseText.primary,
              backgroundColor: colors.text.primary,
            },
            variants: [
              {
                props: {
                  disabled: false,
                  loading: false,
                },

                style: {
                  '&:hover': {
                    backgroundColor: colors.text.secondary,
                  },
                  '&:focus': {
                    backgroundColor: colors.text.secondary,
                  },
                },
              },
            ],
          },
          {
            props: {
              variant: 'outlined',
            },
            style: {
              borderColor: colors.divider.primary,
            },
            variants: [
              {
                props: {
                  variant: 'outlined',
                  loading: false,
                  disabled: false,
                },
                style: {
                  '&:hover': {
                    borderColor: colors.divider.secondary,
                  },
                  '&:focus': {
                    borderColor: colors.divider.secondary,
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  };
});

const ButtonPrefix = memoStyled('span', {
  name: displayName,
  slot: 'Prefix',
})<ButtonPrefixStyleProps>(({ theme }) => {
  const { transitions } = theme;

  return {
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
    variants: [
      {
        props: {
          icon: true,
        },
        style: {
          marginLeft: '-2px',
          marginRight: '2px',
        },
      },
    ],
  };
});

const ButtonSuffix = memoStyled(ButtonPrefix, {
  name: displayName,
  slot: 'Suffix',
})<ButtonPrefixStyleProps>(() => {
  return {
    variants: [
      {
        props: {
          icon: true,
        },
        style: {
          marginLeft: '2px',
          marginRight: '-2px',
        },
      },
    ],
  };
});

const ButtonInner = memoStyled('span', {
  name: displayName,
  slot: 'Inner',
})(() => {
  return {};
});

const loadingKeyframes = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const DefaultLoadingIcon = memoStyled(LoadingOutlined, {
  name: displayName,
  slot: 'LoadingIcon',
})(() => {
  return {
    style: css`
      animation: ${loadingKeyframes} 1s linear infinite;
    `,
  };
});

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
      disabled={disabled}
      loading={loading}
      ref={ref}
      styleProps={{
        color,
        elevation: enableElevation,
        size,
        disabled: !!disabled,
        loading: !!loading,
        variant,
        long: !!long,
        round: !!round,
        icon,
      }}
    >
      {prefix}
      {children && <ButtonInner>{children}</ButtonInner>}
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
