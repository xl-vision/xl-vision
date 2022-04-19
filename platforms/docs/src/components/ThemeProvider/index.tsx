import React from 'react';
import PropTypes from 'prop-types';
import { BaseTheme, ThemeProvider as XlThemeProvider } from '@xl-vision/react';
import { useIsomorphicLayoutEffect } from '@xl-vision/hooks';
import Cookies from 'js-cookie';
import { noop } from '@xl-vision/utils';

export type ThemeProviderProps = {
  children: React.ReactNode;
};

export type ThemeContextProps = {
  isDark: boolean;
  setDark: (value: boolean | ((prev: boolean) => boolean)) => void;
};

export const ThemeContext = React.createContext<ThemeContextProps>({
  isDark: false,
  setDark: noop,
});

const KEY = 'DARK_MODE';

const ThemeProvider: React.FunctionComponent<ThemeProviderProps> = (props) => {
  const { children } = props;

  const [isDark, setDark] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    const dark = Cookies.get(KEY) === 'dark';
    setDark(dark);
  }, []);

  const setDarkWrapper: ThemeContextProps['setDark'] = React.useCallback((dark) => {
    const fn = typeof dark === 'function' ? dark : () => dark;
    setDark((prev) => {
      const result = fn(prev);
      Cookies.set(KEY, result ? 'dark' : 'light', { expires: 30, sameSite: 'strict' });
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

  const ctx = React.useMemo<ThemeContextProps>(
    () => ({
      isDark,
      setDark: setDarkWrapper,
    }),
    [isDark, setDarkWrapper],
  );

  return (
    <ThemeContext.Provider value={ctx}>
      <XlThemeProvider theme={theme}>{children}</XlThemeProvider>
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ThemeProvider;
