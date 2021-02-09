import {
  CSSObject,
  ExtractProps,
  FunctionInterpolation,
  Interpolation,
  ShouldForwardProp,
} from '@xl-vision/styled-engine-types';
import innerStyled from '@xl-vision/styled-engine';
import React from 'react';
import clsx from 'clsx';
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
  let defaultClassName = '';

  if (name) {
    displayName = name + slot;
    defaultClassName = `${name}-${lowercaseFirstLetter(slot)}`;
  }

  const defaultCreateStyledComponent = innerStyled<Tag, ForwardedProps>(tag, {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    shouldForwardProp: shouldForwardProp as ShouldForwardProp<ForwardedProps>,
    prefix: defaultClassName || name || undefined,
  });

  const overrideCreateStyledComponent = <
    S extends {} | undefined = undefined,
    P extends Pick<ExtractProps<Tag>, ForwardedProps> = Pick<ExtractProps<Tag>, ForwardedProps>,
    E extends { styleProps: S; theme: Theme } = { styleProps: S; theme: Theme }
  >(
    first: TemplateStringsArray | CSSObject | FunctionInterpolation<P & E>,
    ...styles: Array<Interpolation<P & E>>
  ) => {
    const DefaultComponent = defaultCreateStyledComponent<any>(first, ...styles);

    const Cmp = React.forwardRef<
      any,
      P & {
        as?: keyof JSX.IntrinsicElements | React.ComponentType<React.ComponentProps<any>>;
      } & (S extends undefined ? { theme?: Theme } : { styleProps: S; theme?: Theme })
    >((props, ref) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, react/prop-types
      const { theme: themeProp, className, ...others } = props as any;

      const defaultTheme = React.useContext(ThemeContext);

      const theme = (themeProp || defaultTheme) as Theme;

      return (
        <DefaultComponent
          {...others}
          ref={ref}
          className={clsx(defaultClassName, className)}
          theme={theme}
        />
      );
    });

    Cmp.displayName = displayName;

    return Cmp;
  };

  return overrideCreateStyledComponent;
};

export default styled;
