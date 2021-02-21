import {
  CSSObject,
  ExtractProps,
  FunctionInterpolation,
  Interpolation,
  ShouldForwardProp,
  SimpleInterpolation,
} from '@xl-vision/styled-engine-types';
import innerStyled from '@xl-vision/styled-engine';
import React from 'react';
import clsx from 'clsx';
import { isDevelopment } from '../utils/env';
import { Theme } from '../ThemeProvider/createTheme';
import ThemeContext from '../ThemeProvider/ThemeContext';
import { OverrideStyles } from '../ThemeProvider/overrideStyles';

export type XlOptions = {
  name?: string;
  slot?: string;
};

const shouldForwardProp = (prop: PropertyKey) => prop !== 'theme' && prop !== 'styleProps';

const middleline = (str: string) => {
  const separator = '-';
  const split = /(?=[A-Z])/;

  return str.split(split).join(separator).toLowerCase();
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
    if (slot === 'Root') {
      defaultClassName = middleline(name);
    }
  }

  const defaultCreateStyledComponent = innerStyled<Tag, ForwardedProps>(tag, {
    shouldForwardProp: shouldForwardProp as ShouldForwardProp<ForwardedProps>,
    // prefix: displayName || undefined,
  });

  const overrideCreateStyledComponent = <
    S extends {} | undefined = undefined,
    P extends Pick<ExtractProps<Tag>, ForwardedProps> = Pick<ExtractProps<Tag>, ForwardedProps>,
    E extends { styleProps: S; theme: Theme } = { styleProps: S; theme: Theme }
  >(
    first: TemplateStringsArray | CSSObject | FunctionInterpolation<P & E>,
    ...styles: Array<Interpolation<P & E>>
  ) => {
    const overrideStyle = (props: P & E) => {
      const { theme } = props;

      let styleArgs = [first, ...styles];

      if (name && slot) {
        const cmp = (theme.overrideStyles as {
          [name: string]: {
            [slot: string]: OverrideStyles;
          };
        })[name];
        if (cmp && cmp[slot]) {
          styleArgs = [cmp[slot]];
        }
      }

      const array: Array<SimpleInterpolation> = [];

      styleArgs.forEach((it) => {
        if (typeof it === 'function') {
          array.push(it(props));
        } else {
          array.push(it);
        }
      });

      return array;
    };

    const DefaultComponent = defaultCreateStyledComponent<any>(overrideStyle);

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

      // eslint-disable-next-line react/prop-types
      const { clsPrefix } = theme;

      return (
        <DefaultComponent
          {...others}
          ref={ref}
          className={clsx(defaultClassName && `${clsPrefix}-${defaultClassName}`, className)}
          theme={theme}
        />
      );
    });

    if (isDevelopment) {
      Cmp.displayName = displayName;
    }

    return Cmp;
  };

  return overrideCreateStyledComponent;
};

export default styled;
