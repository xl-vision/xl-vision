import { CSSObject } from '@xl-vision/styled-engine';
import { ComponentProps, ComponentType, JSX } from 'react';
import { styled, XlOptions } from '../styles';
import { StyledComponent } from '../styles/types';
import { Theme } from '../ThemeProvider';

export type ThemeStyles<SP> = CSSObject & {
  variants?: Array<{
    props: Partial<SP> | Array<Partial<SP>>;
    style: CSSObject;
  }>;
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
        console.log(lastValue, 'miss cache----');
        lastValue = fn({ theme });
        lastTheme = theme;
      }

      const { variants, ...others } = lastValue;

      if (!variants || !variants.length) {
        return lastValue;
      }

      const styles = variants
        .filter((variant) => {
          const variantProps = (
            Array.isArray(variant.props) ? variant.props : [variant.props]
          ) as Array<Record<string, unknown>>;

          return variantProps.some((p) => {
            return Object.keys(p).every((k) => Object.is(p[k], styleProps[k]));
          });
        })
        .map((it) => it.style);

      return [others, ...styles];
    });
  };
};

export default memoStyled;
