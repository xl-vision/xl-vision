import { ThemeProvider } from '@xl-vision/react';
import * as libLocales from '@xl-vision/react/locale';
import { isProduction, warning } from '@xl-vision/utils';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { ReactNode, createContext, useContext, FC, useMemo } from 'react';
import locales, { Locale } from './locales';

export type LocalizationProviderProps = {
  children?: ReactNode;
};

export type LocalizationContextProps = {
  language: string;
  supportLocales: Record<string, Locale>;
  locale: Locale;
};

export const defaultLanguage = 'en-US';

export const LocalizationContext = createContext<LocalizationContextProps>({
  language: defaultLanguage,
  supportLocales: locales,
  locale: locales[defaultLanguage],
});

export const useLocale = () => {
  return useContext(LocalizationContext);
};

const LocalizationProvider: FC<LocalizationProviderProps> = (props) => {
  const { children } = props;

  const { locale: language = defaultLanguage } = useRouter();

  const locale = useMemo(() => {
    if (locales[language]) {
      return locales[language];
    }
    warning(
      true,
      `The specified lang '%s' has no corresponding locale configuration, please provide the corresponding locale file, otherwise the default language (en-US) will be used`,
      language,
    );
    return locales[defaultLanguage];
  }, [language]);

  const ctx = useMemo<LocalizationContextProps>(
    () => ({ language, supportLocales: locales, locale }),
    [language, locale],
  );

  const libLocaleKey = useMemo(() => {
    return language.replace('-', '') as keyof typeof libLocales;
  }, [language]);

  return (
    <LocalizationContext.Provider value={ctx}>
      <ThemeProvider locale={libLocales[libLocaleKey]}>{children}</ThemeProvider>
    </LocalizationContext.Provider>
  );
};

if (!isProduction) {
  LocalizationProvider.displayName = 'LocalizationProvider';
  LocalizationProvider.propTypes = {
    children: PropTypes.node,
  };
}

export default LocalizationProvider;
