import React from 'react';
import PropTypes from 'prop-types';
import { BaseTheme, ThemeProvider as XlThemeProvider } from '@xl-vision/react';

export type ThemeProviderProps = {
  children: React.ReactNode;
};

export type ThemeContextProps = {
  isDark: boolean;
  setDark: (value: boolean | ((prev: boolean) => boolean)) => void;
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

  const setDarkWrapper: ThemeContextProps['setDark'] = React.useCallback((dark) => {
    const fn = typeof dark === 'function' ? dark : () => dark;
    setDark((prev) => {
      const result = fn(prev);
      localStorage.setItem(KEY, result ? 'dark' : 'light');
      return result;
    });
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
