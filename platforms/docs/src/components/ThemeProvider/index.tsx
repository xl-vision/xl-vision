import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider as XlThemeProvider, BaseTheme } from '@xl-vision/react';

export type ThemeProviderProps = {
  children: React.ReactNode;
};

export type ThemeContextProps = {
  isDark: boolean;
  setDark: (value: boolean) => void;
};

export const ThemeContext = React.createContext<ThemeContextProps>({
  isDark: false,
  setDark: () => {},
});

const ThemeProvider: React.FunctionComponent<ThemeProviderProps> = (props) => {
  const { children } = props;

  const [isDark, setDark] = React.useState(false);

  const theme = React.useMemo<BaseTheme>(() => {
    return {
      color: {
        mode: isDark ? 'dark' : 'light',
      },
      overrideStyles: {},
    };
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, setDark }}>
      <XlThemeProvider theme={theme}>{children}</XlThemeProvider>
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ThemeProvider;
