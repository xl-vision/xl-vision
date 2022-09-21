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
  ST = S extends undefined ? { theme: Theme } : { styleProps: S; theme: Theme },
>(
  first: TemplateStringsArray | CSSObject | FunctionInterpolation<P & ST>,
  ...styles: Array<Interpolation<P & ST>>
) => {
  const [newFirst, ...newStyles] = [first, ...styles].map(applyTheme);

  return innerCreateGlobalStyles<P & ST>(newFirst, ...newStyles);
};
export default createGlobalStyles;
