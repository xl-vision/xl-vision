import {
  createGlobalStyles as innerCreateGlobalStyles,
  CSSObject,
  FunctionInterpolation,
  Interpolation,
} from '@xl-vision/styled-engine';
import applyTheme from './applyTheme';
import { Theme } from '../ThemeProvider';

const createGlobalStyles = <
  S extends object | void = void,
  ST = S extends void ? { theme: Theme } : { styleProps: S; theme: Theme },
  SPT = S extends void ? { theme?: Theme } : { styleProps: S; theme?: Theme },
>(
  first: TemplateStringsArray | CSSObject | FunctionInterpolation<object & ST>,
  ...styles: Array<Interpolation<object & ST>>
) => {
  const newStyles = styles.map(applyTheme);

  if (Array.isArray(first) && 'raw' in first) {
    return innerCreateGlobalStyles<object & SPT>(first, ...newStyles);
  }

  return innerCreateGlobalStyles<object & SPT>(applyTheme(first), ...newStyles);
};
export default createGlobalStyles;
