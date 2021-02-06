import {
  CreateStyledComponent,
  CSSObject,
  ExtractProps,
  FilteringStyledOptions,
} from '@xl-vision/styled-engine-types';
import innerStyled from '@xl-vision/styled-engine';
import React from 'react';
import { Theme } from './createTheme';
import ThemeContext from './ThemeContext';

const styled = <
  Tag extends keyof JSX.IntrinsicElements | React.ComponentType<React.ComponentProps<Tag>>,
  ForwardedProps extends keyof ExtractProps<Tag> = keyof ExtractProps<Tag>
>(
  tag: Tag,
  options?: FilteringStyledOptions<ExtractProps<Tag>, ForwardedProps>,
) => {
  const defaultStyleResolver = innerStyled<Tag, ForwardedProps>(tag, options);
  const overrideStyledResolver: CreateStyledComponent<
    Pick<ExtractProps<Tag>, ForwardedProps> & { theme: Theme },
    {}
  > = (first, ...styles) => {
    const DefaultComponent = defaultStyleResolver(first, ...styles);

    const Component = (props: Pick<ExtractProps<Tag>, ForwardedProps> & { theme?: Theme }) => {
      const defaultTheme = React.useContext(ThemeContext);

      const { theme: themeProps, ...others } = props;

      const theme = themeProps || defaultTheme;

      return <DefaultComponent theme={theme} {...others} />;
    };

    return Component;
  };

  return overrideStyledResolver;
};

export default styled;
