import React from 'react';
import PropTypes from 'prop-types';
import { BaseTheme, ThemeProvider as XlThemeProvider } from '@xl-vision/react';

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

const KEY = 'dark_mode';

const ThemeProvider: React.FunctionComponent<ThemeProviderProps> = (props) => {
  const { children } = props;

  const [isDark, setDark] = React.useState(() => {
    if (localStorage) {
      const dark = localStorage.getItem(KEY) === 'dark';
      return dark;
    }
    return false;
  });

  const setDarkWrapper = React.useCallback((dark: boolean) => {
    localStorage.setItem(KEY, dark ? 'dark' : 'light');
    setDark(dark);
  }, []);

  const theme: BaseTheme = React.useMemo(() => {
    return {
      color: {
        mode: isDark ? 'dark' : 'light',
      },
    };
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, setDark: setDarkWrapper }}>
      <XlThemeProvider theme={theme}>{children}</XlThemeProvider>
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ThemeProvider;
