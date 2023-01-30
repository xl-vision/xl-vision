import {
  createGlobalStyles as innerCreateGlobalStyles,
  CSSObject,
  FunctionInterpolation,
  Interpolation,
} from '@xl-vision/styled-engine';
import applyTheme from './applyTheme';
import { Theme } from '../ThemeProvider/createTheme';

const createGlobalStyles = <
  S extends {} | undefined = undefined,
  P extends {} = {},
  ST = S extends undefined ? { theme: Theme } : { styleProps: S; theme: Theme },
  SPT = S extends undefined ? { theme?: Theme } : { styleProps: S; theme?: Theme },
>(
  first: TemplateStringsArray | CSSObject | FunctionInterpolation<P & ST>,
  ...styles: Array<Interpolation<P & ST>>
) => {
  const [newFirst, ...newStyles] = [first, ...styles].map(applyTheme);

  return innerCreateGlobalStyles<P & SPT>(newFirst, ...newStyles);
};
export default createGlobalStyles;
