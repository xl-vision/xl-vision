import React from 'react';
import PropTypes from 'prop-types';
import { BaseTheme, ThemeProvider as XlThemeProvider } from '@xl-vision/react';
import { useLayoutEffect } from '@xl-vision/hooks';
import Cookies from 'js-cookie';

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

const KEY = 'DARK_MODE';

const ThemeProvider: React.FunctionComponent<ThemeProviderProps> = (props) => {
  const { children } = props;

  const [isDark, setDark] = React.useState(false);

  useLayoutEffect(() => {
    const dark = Cookies.get(KEY) === 'dark';
    setDark(dark);
  }, []);

  const setDarkWrapper: ThemeContextProps['setDark'] = React.useCallback((dark) => {
    const fn = typeof dark === 'function' ? dark : () => dark;
    setDark((prev) => {
      const result = fn(prev);
      Cookies.set(KEY, result ? 'dark' : 'light', { expires: 30 });
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
