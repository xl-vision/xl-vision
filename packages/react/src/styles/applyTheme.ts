import { FunctionInterpolation, Interpolation } from '@xl-vision/styled-engine';
import { Theme } from '../ThemeProvider';
import defaultTheme from '../ThemeProvider/defaultTheme';

const applyTheme =
  <P extends { theme?: Theme }>(style: Interpolation<Omit<P, 'theme'> & { theme: Theme }>) =>
  (props: P): Interpolation<Omit<P, 'theme'> & { theme: Theme }> => {
    if (typeof style === 'function') {
      const { theme, ...others } = props;
      const newTheme = isEmpty(theme) ? defaultTheme : theme;
      // TODO [2023-07-01]: types fixed
      const newProps = {
        theme: newTheme,
        ...others,
      } as const;
      return (style as FunctionInterpolation<Omit<P, 'theme'> & { theme: Theme }>)(newProps);
    }
    if (Array.isArray(style)) {
      return (style as Array<Interpolation<Omit<P, 'theme'> & { theme: Theme }>>).map(applyTheme);
    }
    return style;
  };

export default applyTheme;

const isEmpty = (o: object | undefined): o is undefined => {
  if (!o) {
    return true;
  }
  return Object.keys(o).length === 0;
};
