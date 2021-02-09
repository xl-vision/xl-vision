import {
  CSSObject,
  ExtractProps,
  FunctionInterpolation,
  Interpolation,
  ShouldForwardProp,
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
  Tag extends keyof JSX.IntrinsicElements | React.ComponentType<React.ComponentProps<Tag>>,
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

  const defaultCreateStyledComponent = innerStyled<Tag, ForwardedProps>(tag, {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    shouldForwardProp: shouldForwardProp as ShouldForwardProp<ForwardedProps>,
    prefix: className || name || '',
  });

  const overrideCreateStyledComponent = <
    S extends {},
    P extends Pick<ExtractProps<Tag>, ForwardedProps> = Pick<ExtractProps<Tag>, ForwardedProps>,
    E extends { styleProps: S; theme: Theme } = { styleProps: S; theme: Theme }
  >(
    first: TemplateStringsArray | CSSObject | FunctionInterpolation<P & E>,
    ...styles: Array<Interpolation<P & E>>
  ) => {
    const DefaultComponent = defaultCreateStyledComponent<any>(first, ...styles);

    const Cmp = (
      props: P &
        Omit<E, 'theme'> & {
          theme?: Theme;
          as?: keyof JSX.IntrinsicElements | React.ComponentType<React.ComponentProps<any>>;
        },
    ) => {
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
