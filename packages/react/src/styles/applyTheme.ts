import { FunctionInterpolation, Interpolation } from '@xl-vision/styled-engine';
import { StyledComponentKey } from './constants';
import { StyledComponent } from './types';
import { Theme } from '../ThemeProvider';
import defaultTheme from '../ThemeProvider/defaultTheme';

const applyTheme =
  <P extends { theme?: Theme; styleProps?: object }>(
    style: Interpolation<Omit<P, 'theme'> & { theme: Theme }>,
  ) =>
  (props: P): Interpolation<Omit<P, 'theme'> & { theme?: Theme }> => {
    if (Array.isArray(style)) {
      return (style as Array<Interpolation<Omit<P, 'theme'> & { theme: Theme }>>).map(applyTheme);
    }

    const theme = isEmpty(props.theme) ? defaultTheme : props.theme;

    if (typeof style === 'function') {
      const newProps = {
        ...props,
        theme,
      } as const;

      const result = (style as FunctionInterpolation<Omit<P, 'theme'> & { theme: Theme }>)(
        newProps,
      );

      return result;
    }

    if (typeof style === 'object') {
      const styledComponent = (style as StyledComponent)[StyledComponentKey];

      if (styledComponent) {
        return styledComponent;
      }
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
