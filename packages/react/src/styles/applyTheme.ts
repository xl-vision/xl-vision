import { Interpolation } from '@xl-vision/styled-engine';
import { Theme } from '../ThemeProvider';
import defaultTheme from '../ThemeProvider/defaultTheme';

const applyTheme =
  <P extends {}, S extends { theme?: Theme }>(
    style: Interpolation<P, Omit<S, 'theme'> & { theme: Theme }>,
  ) =>
  (props: P & S) => {
    if (typeof style === 'function') {
      const { theme, ...others } = props;
      const newTheme = isEmpty(theme) ? defaultTheme : theme;
      // TODO [2022-05-01]: types fixed
      const newProps = {
        theme: newTheme,
        ...others,
      } as unknown as P & Omit<S, 'theme'> & { theme: Theme };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return style(newProps);
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
