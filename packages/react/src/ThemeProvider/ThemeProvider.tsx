import { ThemeContext as StyledThemeContext } from '@xl-vision/styled-engine';
import PropTypes from 'prop-types';
import React from 'react';
import { env } from '@xl-vision/utils';
import createTheme, { BaseTheme } from './createTheme';
import ThemeContext from './ThemeContext';
import { deepMerge } from '../utils/function';

export type ThemeProviderProps = {
  children: React.ReactNode;
  theme?: BaseTheme;
};

const ThemeProvider: React.FunctionComponent<ThemeProviderProps> = (props) => {
  const { children, theme } = props;

  const parentTheme = React.useContext(ThemePropsContext);

  // 可能存在多个主题嵌套的情况，子主题应该继承父主题
  const mergedThemeProps = React.useMemo(() => {
    return deepMerge(parentTheme, theme);
  }, [theme, parentTheme]);

  const value = React.useMemo(() => {
    return createTheme(mergedThemeProps);
  }, [mergedThemeProps]);

  return (
    <ThemePropsContext.Provider value={mergedThemeProps}>
      {/* both self ThemeContext and styled-engine ThemeContext */}
      <ThemeContext.Provider value={value}>
        <StyledThemeContext.Provider value={value}>{children}</StyledThemeContext.Provider>
      </ThemeContext.Provider>
    </ThemePropsContext.Provider>
  );
};

if (!env.isProduction) {
  ThemeProvider.displayName = 'ThemeProvider';

  ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired,
    theme: PropTypes.object,
  };
}

export default ThemeProvider;

const ThemePropsContext = React.createContext<BaseTheme>({});
