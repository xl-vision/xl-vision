import {
  CSSObject,
  ExtractProps,
  FilteringStyledOptions,
  FunctionInterpolation,
  Interpolation,
  StyledComponent,
} from '@xl-vision/styled-engine-types';
import innerStyled from '@xl-vision/styled-engine';
import React from 'react';
import { Theme } from './createTheme';
import ThemeContext from './ThemeContext';

export type XlOptions = {
  name?: string;
  slot?: string;
};

const shouldForwardProp = <
  Props extends { theme: Theme },
  ForwardedProps extends keyof Props = keyof Props
>(
  prop: keyof Props,
): prop is ForwardedProps => prop !== 'theme';

const styled = <
  Tag extends keyof JSX.IntrinsicElements | React.ComponentType<React.ComponentProps<Tag>>,
  ForwardedProps extends keyof ExtractProps<Tag> = keyof ExtractProps<Tag>,
  StyleProps extends { theme: Theme } = { theme: Theme },
  P = Pick<ExtractProps<Tag>, ForwardedProps>,
  PS = P & StyleProps
>(
  tag: Tag,
  options?: FilteringStyledOptions,
) => {
  const defaultCreateStyledComponent = innerStyled<Tag, ForwardedProps, StyleProps>(tag, {
    shouldForwardProp,
    ...options,
  });

  const overrideCreateStyledComponent = (
    first: TemplateStringsArray | CSSObject | FunctionInterpolation<PS>,
    ...styles: Array<Interpolation<PS>>
  ) => {
    const DefaultComponent = defaultCreateStyledComponent(first, ...styles);

    const Cmp: StyledComponent<P, Omit<StyleProps, 'theme'> & { theme?: Theme }> = (props) => {
      // eslint-disable-next-line react/prop-types
      const { theme: themeProp, ...others } = props;

      const defaultTheme = React.useContext(ThemeContext);

      const theme = themeProp || defaultTheme;

      // @ts-ignore
      return <DefaultComponent {...others} theme={theme} />;
    };

    return Cmp;
  };

  return overrideCreateStyledComponent;
};

export default styled;
