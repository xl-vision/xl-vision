import { createGlobalStyles as innerCreateGlobalStyles } from '@xl-vision/styled-engine';
import { CSSObject, FunctionInterpolation, Interpolation } from '@xl-vision/styled-engine-types';
import { Theme } from '../ThemeProvider/createTheme';
import { createStyleWithTheme } from './styled';

const createGlobalStyles = <P extends { theme: Theme } = { theme: Theme }>(
  first: TemplateStringsArray | CSSObject | FunctionInterpolation<P>,
  ...styles: Array<Interpolation<P>>
) => {
  const newArray = [first, ...styles].map(createStyleWithTheme);

  // @ts-ignore
  return innerCreateGlobalStyles(...newArray);
};
export default createGlobalStyles;
