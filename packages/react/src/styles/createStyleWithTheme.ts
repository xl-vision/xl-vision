import { Interpolation } from '@xl-vision/styled-engine-types';
import { Theme } from '../ThemeProvider';
import defaultTheme from '../ThemeProvider/defaultTheme';

export const createStyleWithTheme = <
  P extends { theme?: Theme },
  Q = Omit<P, 'theme'> & { theme: Theme }
>(
  style: Interpolation<Q>,
) => (props: P) => {
  if (typeof style === 'function') {
    const { theme, ...others } = props;
    const newTheme = isEmpty(theme) ? defaultTheme : theme;
    const newProps = {
      theme: newTheme,
      ...others,
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return style((newProps as unknown) as Q);
  }
  return style;
};

const isEmpty = (o: any): o is undefined => {
  if (!o) {
    return true;
  }
  return Object.keys(o).length === 0;
};
