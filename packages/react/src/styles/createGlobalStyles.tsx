import { createGlobalStyles as innerCreateGlobalStyles } from '@xl-vision/styled-engine';
import { CSSObject, FunctionInterpolation, Interpolation } from '@xl-vision/styled-engine-types';
import { Theme } from '../ThemeProvider/createTheme';
import applyTheme from './applyTheme';

const createGlobalStyles = <
  P extends { theme: Theme } = { theme: Theme },
  Q = Omit<P, 'theme'> & { theme?: Theme }
>(
  first: TemplateStringsArray | CSSObject | FunctionInterpolation<P>,
  ...styles: Array<Interpolation<P>>
) => {
  const newArray = [first, ...styles].map(applyTheme);

  // @ts-ignore
  return innerCreateGlobalStyles<Q>(...newArray);
};
export default createGlobalStyles;
