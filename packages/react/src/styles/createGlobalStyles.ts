import {
  createGlobalStyles as innerCreateGlobalStyles,
  CSSObject,
  FunctionInterpolation,
  Interpolation,
} from '@xl-vision/styled-engine';
import { Theme } from '../ThemeProvider/createTheme';
import applyTheme from './applyTheme';

const createGlobalStyles = <
  S extends {} | undefined = undefined,
  P extends {} = {},
  E = S extends undefined ? { theme: Theme } : { styleProps: S; theme: Theme },
  V extends {} = Omit<E, 'theme'> & { theme?: Theme },
>(
  first: TemplateStringsArray | CSSObject | FunctionInterpolation<P, E>,
  ...styles: Array<Interpolation<P, E>>
) => {
  const [newFirst, ...newStyles] = [first, ...styles].map(applyTheme);

  return innerCreateGlobalStyles<P, V>(newFirst, ...newStyles);
};
export default createGlobalStyles;
