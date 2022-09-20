import { ThemeContext as StyledThemeContext } from '@xl-vision/styled-engine';
import PropTypes from 'prop-types';
import { isProduction, deepMerge } from '@xl-vision/utils';
import { ReactNode, FC, useContext, useMemo, createContext } from 'react';
import createTheme, { BaseTheme } from './createTheme';
import ThemeContext from './ThemeContext';

export type ThemeProviderProps = {
  children: ReactNode;
  theme?: BaseTheme;
};

const ThemeProvider: FC<ThemeProviderProps> = (props) => {
  const { children, theme } = props;

  const parentTheme = useContext(ThemePropsContext);

  // 可能存在多个主题嵌套的情况，子主题应该继承父主题
  const mergedThemeProps = useMemo(() => {
    if (parentTheme) {
      return deepMerge(parentTheme, theme);
    }
    return theme;
  }, [theme, parentTheme]);

  const value = useMemo(() => {
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

if (!isProduction) {
  ThemeProvider.displayName = 'ThemeProvider';

  ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired,
    theme: PropTypes.object,
  };
}

export default ThemeProvider;

const ThemePropsContext = createContext<BaseTheme | undefined>(undefined);
