import { createGlobalStyles as innerCreateGlobalStyles } from '@xl-vision/styled-engine';
import { CSSObject, FunctionInterpolation, Interpolation } from '@xl-vision/styled-engine-types';
import { Theme } from '../ThemeProvider/createTheme';
import applyTheme from './applyTheme';

const createGlobalStyles = <
  S extends {} | undefined = undefined,
  E = S extends undefined ? { theme: Theme } : { styleProps: S; theme: Theme },
  V = Omit<E, 'theme'> & { theme?: Theme }
>(
  first: TemplateStringsArray | CSSObject | FunctionInterpolation<E>,
  ...styles: Array<Interpolation<E>>
) => {
  const newArray = [first, ...styles].map(applyTheme);

  // @ts-ignore
  return innerCreateGlobalStyles<V>(...newArray);
};
export default createGlobalStyles;
