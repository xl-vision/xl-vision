import {
  CSSObject,
  ExtractProps,
  FunctionInterpolation,
  Interpolation,
  ShouldForwardProp,
} from '@xl-vision/styled-engine-types';
import innerStyled from '@xl-vision/styled-engine';
import React from 'react';
import { isDevelopment } from '../utils/env';
import { Theme } from '../ThemeProvider/createTheme';
import { Style } from '../ThemeProvider/overrideStyles';
import { createStyleWithTheme } from './createStyleWithTheme';

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
  let prefix = '';

  if (name) {
    displayName = name + slot;
    if (slot === 'Root') {
      prefix = middleline(name);
    }
  }

  const defaultCreateStyledComponent = innerStyled<Tag, ForwardedProps>(tag, {
    shouldForwardProp: shouldForwardProp as ShouldForwardProp<ForwardedProps>,
    prefix: prefix || undefined,
  });

  const overrideCreateStyledComponent = <
    S extends {} | undefined = undefined,
    P extends Pick<ExtractProps<Tag>, ForwardedProps> = Pick<ExtractProps<Tag>, ForwardedProps>,
    E = S extends undefined ? { theme: Theme } : { styleProps: S; theme: Theme },
    V = Omit<E, 'theme'> & { theme?: Theme }
  >(
    first: TemplateStringsArray | CSSObject | FunctionInterpolation<P & E>,
    ...styles: Array<Interpolation<P & E>>
  ) => {
    const newArray = [first, ...styles].map(createStyleWithTheme);

    newArray.push(
      createStyleWithTheme((props) => {
        const { theme } = props;
        if (!name || !slot) {
          return;
        }
        const overrideStyles = theme.overrideStyles as {
          [key: string]: {
            [key: string]: Style;
          };
        };

        const overrideStyle = overrideStyles[name];

        if (!overrideStyle) {
          return;
        }
        const overrideSlotStyle = overrideStyle[slot];
        if (!overrideSlotStyle) {
          return;
        }
        if (typeof overrideSlotStyle === 'function') {
          return overrideSlotStyle(props);
        }
        return overrideSlotStyle;
      }),
    );

    // @ts-ignore
    const DefaultComponent = defaultCreateStyledComponent<P & V>(...newArray);

    if (isDevelopment) {
      DefaultComponent.displayName = displayName;
    }

    return DefaultComponent;
  };

  return overrideCreateStyledComponent;
};

export default styled;
