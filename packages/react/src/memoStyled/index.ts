import { Css, CSSObject } from '@xl-vision/styled-engine';
import { isEqual } from '@xl-vision/utils';
import { ComponentProps, ComponentType, JSX } from 'react';
import { styled, XlOptions } from '../styles';
import { StyledComponent } from '../styles/types';
import { Theme } from '../ThemeProvider';

export type ThemeStyleValue = CSSObject | Css;

export type ThemeStyleVariant<SP> = {
  props: Partial<SP> | Array<Partial<SP>>;
  style: ThemeStyleValue;
  variants?: Array<ThemeStyleVariant<SP>>;
};

export type ThemeStyles<SP> = CSSObject & {
  style?: ThemeStyleValue | Array<ThemeStyleValue>;
  variants?: Array<ThemeStyleVariant<SP>>;
};

export type ThemeStyleFunction<SP> = (props: { theme: Theme }) => ThemeStyles<SP>;

const memoStyled = <Tag extends keyof JSX.IntrinsicElements | ComponentType<ComponentProps<Tag>>>(
  tag: Tag & StyledComponent,
  options?: XlOptions,
) => {
  const styledFn = styled(tag, options);

  return <SP extends object | void = void>(fn: ThemeStyleFunction<SP>) => {
    let lastTheme: Theme | undefined;
    let lastValue: {
      styles: Array<ThemeStyleValue>;
      variants: Array<ThemeStyleVariant<SP>>;
    };
    return styledFn<SP>((props) => {
      const { styleProps = {}, theme } = props as {
        theme: Theme;
        styleProps?: Record<string, unknown>;
      };

      if (!lastValue || lastTheme !== theme) {
        // console.log(lastValue, 'miss cache----');
        const { style, variants, ...others } = fn({ theme });
        const styles: Array<ThemeStyleValue> = [others];

        if (style) {
          styles.push(...(Array.isArray(style) ? style : [style]));
        }

        lastValue = {
          styles,
          variants: variants || [],
        };

        lastTheme = theme;
      }

      const { variants, styles } = lastValue;

      if (!variants.length) {
        return styles;
      }

      const variantStyles = filterVariants(variants, styleProps);

      return [...styles, ...variantStyles];
    });
  };
};

export default memoStyled;

const filterVariants = <SP extends object>(
  variants: Array<ThemeStyleVariant<SP>>,
  styleProps: SP,
): Array<ThemeStyleValue> => {
  const matched: Array<ThemeStyleValue> = [];

  variants.forEach(({ style, props, variants: innerVariants }) => {
    const propArray: Array<Record<string, unknown>> = Array.isArray(props) ? props : [props];

    if (
      propArray.some((p) =>
        Object.keys(p).every((k) => isEqual(p[k], (styleProps as Record<string, unknown>)[k])),
      )
    ) {
      matched.push(style);

      if (innerVariants) {
        matched.push(...filterVariants(innerVariants, styleProps));
      }
    }
  });

  return matched;
};
