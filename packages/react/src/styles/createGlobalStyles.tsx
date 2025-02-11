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
  P extends object = object,
  ST = S extends void ? { theme: Theme } : { styleProps: S; theme: Theme },
  SPT = S extends void ? { theme?: Theme } : { styleProps: S; theme?: Theme },
>(
  first: TemplateStringsArray | CSSObject | FunctionInterpolation<P & ST>,
  ...styles: Array<Interpolation<P & ST>>
) => {
  const newStyles = styles.map(applyTheme);

  if (Array.isArray(first) && 'raw' in first) {
    return innerCreateGlobalStyles<P & SPT>(first, ...newStyles);
  }

  return innerCreateGlobalStyles<P & SPT>(applyTheme(first), ...newStyles);

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
