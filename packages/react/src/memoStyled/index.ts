import { CSSObject } from '@xl-vision/styled-engine';
import { isEqual } from '@xl-vision/utils';
import { ComponentProps, ComponentType, JSX } from 'react';
import { styled, XlOptions } from '../styles';
import { StyledComponent } from '../styles/types';
import { Theme } from '../ThemeProvider';

export type StyleVariant<SP> = {
  props: Partial<SP> | Array<Partial<SP>>;
  style: CSSObject;
  variants?: Array<StyleVariant<SP>>;
};

export type ThemeStyles<SP> = CSSObject & {
  variants?: Array<StyleVariant<SP>>;
};

export type ThemeStyleFunction<SP> = (props: { theme: Theme }) => ThemeStyles<SP>;

const memoStyled = <Tag extends keyof JSX.IntrinsicElements | ComponentType<ComponentProps<Tag>>>(
  tag: Tag & StyledComponent,
  options?: XlOptions,
) => {
  const styledFn = styled(tag, options);

  return <SP extends object | void = void>(fn: ThemeStyleFunction<SP>) => {
    let lastTheme: Theme | undefined;
    let lastValue: ThemeStyles<SP>;
    return styledFn<SP>((props) => {
      const { styleProps = {}, theme } = props as {
        theme: Theme;
        styleProps?: Record<string, unknown>;
      };

      if (!lastValue || lastTheme !== theme) {
        // console.log(lastValue, 'miss cache----');
        lastValue = fn({ theme });
        lastTheme = theme;
      }

      const { variants, ...others } = lastValue;

      if (!variants || !variants.length) {
        return lastValue;
      }

      const styles = filterVariants(variants, styleProps);

      return [others, ...styles];
    });
  };
};

export default memoStyled;

const filterVariants = <SP extends object>(
  variants: Array<StyleVariant<SP>>,
  styleProps: SP,
): Array<CSSObject> => {
  const matched: Array<CSSObject> = [];

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
