import { Interpolation } from '@xl-vision/styled-engine-types';
import { Theme } from '../ThemeProvider';
import defaultTheme from '../ThemeProvider/defaultTheme';

const applyTheme = <P extends { theme?: Theme }>(style: Interpolation<P>) => (props: P) => {
  if (typeof style === 'function') {
    const { theme, ...others } = props;
    const newTheme = isEmpty(theme) ? defaultTheme : theme;
    const newProps = {
      theme: newTheme,
      ...others,
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return style(newProps as any);
  }
  return style;
};

export default applyTheme;

const isEmpty = (o: any): o is undefined => {
  if (!o) {
    return true;
  }
  return Object.keys(o).length === 0;
};
