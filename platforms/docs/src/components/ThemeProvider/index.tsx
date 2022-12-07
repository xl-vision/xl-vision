import { useIsomorphicLayoutEffect } from '@xl-vision/hooks';
import { BaseTheme, ThemeProvider as XlThemeProvider } from '@xl-vision/react';
import { noop } from '@xl-vision/utils';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import { ReactNode, createContext, FC, useState, useCallback, useMemo } from 'react';

export type ThemeProviderProps = {
  children: ReactNode;
};

export type ThemeContextProps = {
  isDark: boolean;
  setDark: (value: boolean | ((prev: boolean) => boolean)) => void;
};

export const ThemeContext = createContext<ThemeContextProps>({
  isDark: false,
  setDark: noop,
});

const KEY = 'DARK_MODE';

const ThemeProvider: FC<ThemeProviderProps> = (props) => {
  const { children } = props;

  const [isDark, setDark] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const dark = Cookies.get(KEY) === 'dark';
    setDark(dark);
  }, []);

  const setDarkWrapper: ThemeContextProps['setDark'] = useCallback((dark) => {
    const fn = typeof dark === 'function' ? dark : () => dark;
    setDark((prev) => {
      const result = fn(prev);
      Cookies.set(KEY, result ? 'dark' : 'light', { expires: 30, sameSite: 'strict' });
      return result;
    });
  }, []);

  const theme: BaseTheme = useMemo(() => {
    return {
      color: {
        mode: isDark ? 'dark' : 'light',
      },
    };
  }, [isDark]);

  const ctx = useMemo<ThemeContextProps>(
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
