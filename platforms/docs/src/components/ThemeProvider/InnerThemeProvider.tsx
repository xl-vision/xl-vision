'use client';

import { ThemeInput, ThemeProvider as XlThemeProvider } from '@xl-vision/react';
import * as libLocales from '@xl-vision/react/locale';
import darkTheme from '@xl-vision/react/themes/dark';
import Cookie from 'js-cookie';
import { ReactNode, FC, useState, useCallback, useMemo } from 'react';
import { DARK_MODE_KEY } from './constants';
import ThemeContext, { ThemeContextProps } from './ThemeContext';
import useLocale from '../../hooks/useLocale';

export type InnerThemeProviderProps = {
  cookieValue?: string;
  children: ReactNode;
};

const InnerThemeProvider: FC<InnerThemeProviderProps> = (props) => {
  const { children, cookieValue } = props;

  const { lang } = useLocale();

  const libLocaleKey = useMemo(() => {
    return lang.replace('-', '') as keyof typeof libLocales;
  }, [lang]);

  const [isDark, setDark] = useState(cookieValue === 'dark');

  const setDarkWrapper: ThemeContextProps['setDark'] = useCallback((dark) => {
    const fn = typeof dark === 'function' ? dark : () => dark;
    setDark((prev) => {
      const result = fn(prev);
      Cookie.set(DARK_MODE_KEY, result ? 'dark' : 'light', { expires: 30, sameSite: 'strict' });
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

export default InnerThemeProvider;
