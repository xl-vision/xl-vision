import { createGlobalStyles as innerCreateGlobalStyles } from '@xl-vision/styled-engine';
import {
  CSSObject,
  FunctionInterpolation,
  GlobalStyleComponent,
  Interpolation,
} from '@xl-vision/styled-engine-types';
import React from 'react';
import { Theme } from './createTheme';
import ThemeContext from './ThemeContext';

const createGlobalStyles = <P extends { theme: Theme } = { theme: Theme }>(
  first: TemplateStringsArray | CSSObject | FunctionInterpolation<P>,
  ...styles: Array<Interpolation<P>>
) => {
  const DefaultGlobalStyleComponent = innerCreateGlobalStyles<any>(first, ...styles);

  const OverrideGlobalStyleComponent: GlobalStyleComponent<Omit<P, 'theme'> & { theme?: Theme }> = (
    props,
  ) => {
    // eslint-disable-next-line react/prop-types
    const { theme: themeProp, ...others } = props;

    const defaultTheme = React.useContext(ThemeContext);

    const theme = themeProp || defaultTheme;

    return <DefaultGlobalStyleComponent {...others} theme={theme} />;
  };

  return OverrideGlobalStyleComponent;
};
export default createGlobalStyles;
