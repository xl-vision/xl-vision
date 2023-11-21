'use client';

import { useIsomorphicLayoutEffect } from '@xl-vision/hooks';
import { ThemeInput, ThemeProvider as XlThemeProvider } from '@xl-vision/react';
import * as libLocales from '@xl-vision/react/locale';
import darkTheme from '@xl-vision/react/themes/dark';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import { ReactNode, FC, useState, useCallback, useMemo } from 'react';
import ThemeContext, { ThemeContextProps } from './ThemeContext';
import useLocale from '../../hooks/useLocale';

export type ThemeProviderProps = {
  children: ReactNode;
};

const KEY = 'DARK_MODE';

const ThemeProvider: FC<ThemeProviderProps> = (props) => {
  const { children } = props;

  const { lang } = useLocale();

  const libLocaleKey = useMemo(() => {
    return lang.replace('-', '') as keyof typeof libLocales;
  }, [lang]);

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

  const theme: ThemeInput = useMemo(() => {
    const value = isDark ? darkTheme : {};

    return {
      ...value,
      locale: libLocales[libLocaleKey],
    };
  }, [isDark, libLocaleKey]);

  const ctx = useMemo<ThemeContextProps>(
    () => ({
      isDark,
      setDark: setDarkWrapper,
    }),
    [isDark, setDarkWrapper],
  );

  return (
    <ThemeContext.Provider value={ctx}>
      <XlThemeProvider {...theme}>{children}</XlThemeProvider>
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ThemeProvider;
