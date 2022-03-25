import {
  styled as innerStyled,
  CSSObject,
  ExtractProps,
  FunctionInterpolation,
  Interpolation,
  ShouldForwardProp,
} from '@xl-vision/styled-engine';
import { env } from '@xl-vision/utils';
import { ComponentProps, ComponentType } from 'react';
import { Theme } from '../ThemeProvider/createTheme';
import { Style } from '../ThemeProvider/overrideStyles';
import applyTheme from './applyTheme';

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
  Tag extends keyof JSX.IntrinsicElements | ComponentType<ComponentProps<Tag>>,
  ForwardedProps extends keyof ExtractProps<Tag> = keyof ExtractProps<Tag>,
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
    ...(env.isDevelopment && { prefix: prefix || undefined }),
  });

  const overrideCreateStyledComponent = <
    S extends {} | undefined = undefined,
    P extends Pick<ExtractProps<Tag>, ForwardedProps> = Pick<ExtractProps<Tag>, ForwardedProps>,
    E = S extends undefined ? { theme: Theme } : { styleProps: S; theme: Theme },
    V = Omit<E, 'theme'> & { theme?: Theme },
  >(
    first: TemplateStringsArray | CSSObject | FunctionInterpolation<P, E>,
    ...styles: Array<Interpolation<P, E>>
  ) => {
    const applyOverrideStyle = (props: P & E & { theme: Theme }) => {
      const { theme } = props;
      if (!name || !slot) {
        return;
      }
      const overrideStyles = theme.overrideStyles as Record<string, Record<string, Style<S, P>>>;

      const overrideStyle = overrideStyles[name];

      if (!overrideStyle) {
        return;
      }
      const overrideSlotStyle = overrideStyle[slot];
      if (!overrideSlotStyle) {
        return;
      }
      if (typeof overrideSlotStyle === 'function') {
        // TODO [2022-04-01]: type fix
        return (overrideSlotStyle as unknown as FunctionInterpolation<P, E>)(props);
      }
      return overrideSlotStyle;
    };

    const newStyles = [...styles, applyOverrideStyle].map(applyTheme);

    let newFirst: any = first;

    const numOfCustomFnsApplied = newStyles.length - styles.length;

    if (Array.isArray(newFirst) && numOfCustomFnsApplied > 0) {
      const newFirstArray = newFirst as unknown as TemplateStringsArray;
      const placeholders = new Array<string>(numOfCustomFnsApplied).fill('');
      const raw = [...newFirstArray.raw, ...placeholders];
      newFirst = [...newFirstArray, ...placeholders];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      newFirst.raw = raw;
    } else if (typeof newFirst === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      newFirst = applyTheme(newFirst);
    }

    const DefaultComponent = defaultCreateStyledComponent<P & V>(
      newFirst as TemplateStringsArray | CSSObject | FunctionInterpolation<P, V>,
      ...newStyles,
    );

    if (!env.isProduction) {
      DefaultComponent.displayName = displayName;
    }

    return DefaultComponent;
  };

  return overrideCreateStyledComponent;
};

export default styled;
