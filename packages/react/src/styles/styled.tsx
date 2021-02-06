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

const styled = <
  Tag extends keyof JSX.IntrinsicElements | React.ComponentType<React.ComponentProps<Tag>>,
  ForwardedProps extends keyof ExtractProps<Tag> = keyof ExtractProps<Tag>,
  StyleProps extends { theme: Theme } = { theme: Theme }
>(
  tag: Tag,
  options?: FilteringStyledOptions<ExtractProps<Tag>, ForwardedProps>,
) => {
  const defaultCreateStyledComponent = innerStyled<Tag, ForwardedProps, StyleProps>(tag, options);

  const overrideCreateStyledComponent = <AdditionalProps extends object = {}>(
    first:
      | TemplateStringsArray
      | CSSObject
      | FunctionInterpolation<
          Pick<ExtractProps<Tag>, ForwardedProps> & StyleProps & AdditionalProps
        >,
    ...styles: Array<
      Interpolation<Pick<ExtractProps<Tag>, ForwardedProps> & StyleProps & AdditionalProps>
    >
  ) => {
    const DefaultComponent = defaultCreateStyledComponent(first, ...styles);

    const Cmp: StyledComponent<
      Pick<ExtractProps<Tag>, ForwardedProps>,
      Omit<StyleProps, 'theme'> & { theme?: Theme }
    > = (props) => {
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
