import {
  CSSObject,
  ExtractProps,
  FilteringStyledOptions,
  FunctionInterpolation,
  Interpolation,
  PropsOf,
  ShouldForwardProp,
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

const shouldForwardProp = (prop: PropertyKey) => prop !== 'theme' && prop !== 'styleProps';

const lowercaseFirstLetter = (str: string) => {
  return str.charAt(0).toLowerCase() + str.slice(1);
};

const styled = <
  StyleProps extends object | undefined,
  Tag extends keyof JSX.IntrinsicElements | React.ComponentType<React.ComponentProps<Tag>> =
    | keyof JSX.IntrinsicElements
    | React.ComponentType<React.ComponentProps<any>>,
  ForwardedProps extends keyof ExtractProps<Tag> = keyof ExtractProps<Tag>
>(
  tag: Tag,
  options?: XlOptions,
) => {
  const { name, slot = 'Root' } = options || {};

  let displayName = '';
  let className = '';

  if (name) {
    displayName = name + slot;
    className = `${name}-${lowercaseFirstLetter(slot)}`;
  }

  const defaultCreateStyledComponent = innerStyled<
    Tag,
    ForwardedProps,
    { styleProps: StyleProps; theme: Theme }
  >(tag, {
    shouldForwardProp: shouldForwardProp as ShouldForwardProp<ForwardedProps>,
    prefix: className || name || '',
  });

  const overrideCreateStyledComponent = (
    first:
      | TemplateStringsArray
      | CSSObject
      | FunctionInterpolation<
          Pick<ExtractProps<Tag>, ForwardedProps> & { styleProps: StyleProps; theme: Theme }
        >,
    ...styles: Array<
      Interpolation<
        Pick<ExtractProps<Tag>, ForwardedProps> & { styleProps: StyleProps; theme: Theme }
      >
    >
  ) => {
    const DefaultComponent = defaultCreateStyledComponent(first, ...styles);

    const Cmp: StyledComponent<P, { styleProps: StyleProps; theme?: Theme }> = (props) => {
      // eslint-disable-next-line react/prop-types
      const { theme: themeProp, ...others } = props;

      const defaultTheme = React.useContext(ThemeContext);

      const theme = themeProp || defaultTheme;

      // @ts-ignore
      return <DefaultComponent {...others} theme={theme} />;
    };

    Cmp.displayName = displayName;

    return Cmp;
  };

  return overrideCreateStyledComponent;
};

export default styled;

const A = styled<{ a: number }>('div')`
  color: ${(p) => p.styleProps.a};
`;
const b = <A styleProps={{ a: 1 }} />;
