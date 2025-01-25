import { FunctionInterpolation, Interpolation } from '@xl-vision/styled-engine';
import { Theme } from '../ThemeProvider';
import defaultTheme from '../ThemeProvider/defaultTheme';
import { shallowEqual } from '../utils/function';

const createApplyTheme = () => {
  const cache = new WeakMap<
    object,
    {
      theme: Theme;
      result: unknown;
    }
  >();

  const applyTheme =
    <P extends { theme?: Theme; styleProps?: object }>(
      style: Interpolation<Omit<P, 'theme'> & { theme: Theme }>,
    ) =>
    (props: P): Interpolation<Omit<P, 'theme'> & { theme?: Theme }> => {
      if (typeof style === 'function') {
        const { theme, ...others } = props;
        const newTheme = isEmpty(theme) ? defaultTheme : theme;

        const newProps = {
          theme: newTheme,
          ...others,
        } as const;

        const disabledStyleProps = isEmpty(newProps.styleProps);

        if (disabledStyleProps) {
          const cacheData = cache.get(style);

          if (cacheData) {
            const { theme, result } = cacheData;

            if (shallowEqual(theme, newProps.theme)) {
              return result;
            }
          }
        }

        const result = (style as FunctionInterpolation<Omit<P, 'theme'> & { theme: Theme }>)(
          newProps,
        );

        if (disabledStyleProps) {
          cache.set(style, {
            theme: newProps.theme,
            result,
          });
        }
        // else {
        //   if (!isProduction && warningFlag) {
        //     console.warn('Disable cache when you pass styleProps:', newProps.styleProps, '\n');
        //     warningFlag = false;
        //   }
        // }

        return result;
      }
      if (Array.isArray(style)) {
        return (style as Array<Interpolation<Omit<P, 'theme'> & { theme: Theme }>>).map(applyTheme);
      }
      return style;
    };

  return applyTheme;
};

export default createApplyTheme;

const isEmpty = (o: object | undefined): o is undefined => {
  if (!o) {
    return true;
  }
  return Object.keys(o).length === 0;
};
