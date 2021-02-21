import { createGlobalStyles as innerCreateGlobalStyles } from '@xl-vision/styled-engine';
import {
  CSSObject,
  FunctionInterpolation,
  Interpolation,
  SimpleInterpolation,
} from '@xl-vision/styled-engine-types';
import { Theme } from '../ThemeProvider/createTheme';
import defaultTheme from '../ThemeProvider/defaultTheme';

const createGlobalStyles = <P extends { theme: Theme } = { theme: Theme }>(
  first: TemplateStringsArray | CSSObject | FunctionInterpolation<P>,
  ...styles: Array<Interpolation<P>>
) => {
  const overrideStyle = <Prop extends { theme?: Theme }>(props: Prop) => {
    const { theme = defaultTheme, ...others } = props;

    const styleArgs = [first, ...styles];

    const array: Array<SimpleInterpolation> = [];

    styleArgs.forEach((it) => {
      if (typeof it === 'function') {
        array.push(it({ theme, ...others }));
      } else {
        array.push(it);
      }
    });

    return array;
  };

  return innerCreateGlobalStyles(overrideStyle);
};
export default createGlobalStyles;
