import {
  createGlobalStyles as innerCreateGlobalStyles,
  CSSObject,
  FunctionInterpolation,
  Interpolation,
} from '@xl-vision/styled-engine';
import { forwardRef } from 'react';
import applyTheme from './applyTheme';
import { Theme, useTheme } from '../ThemeProvider';

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

  // // @ts-expect-error
  // // eslint-disable-next-line react/display-name
  // const DefaultComponent: typeof InnerComponent = forwardRef((props, ref) => {
  //   const { clsPrefix } = useTheme();

  //   // @ts-expect-error
  //   return <InnerComponent {...props} clsPrefix={clsPrefix} ref={ref} />;
  // });

  // return DefaultComponent;
};
export default createGlobalStyles;
