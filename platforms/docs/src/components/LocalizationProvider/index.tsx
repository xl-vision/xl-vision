import React from 'react';
import { LocalizationProvider as XlLocalizationProvider } from '@xl-vision/react';
import { env } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import warning from '@xl-vision/react/utils/warning';
import { useRouter } from 'next/router';
import { defaultLanguage } from '@xl-vision/react/locale';
import locales, { Locale } from './locales';

export type LocalizationProviderProps = {
  children?: React.ReactNode;
};

export type LocalizationContextProps = {
  language: string;
  supportLocales: Record<string, Locale>;
  locale: Locale;
};

export const LocalizationContext = React.createContext<LocalizationContextProps>({
  language: defaultLanguage,
  supportLocales: locales,
  locale: locales[defaultLanguage],
});

export const useLocale = () => {
  return React.useContext(LocalizationContext);
};

const LocalizationProvider: React.FunctionComponent<LocalizationProviderProps> = (props) => {
  const { children } = props;

  const { locale: language = defaultLanguage } = useRouter();

  const locale = React.useMemo(() => {
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

  return (
    <LocalizationContext.Provider value={{ language, supportLocales: locales, locale }}>
      <XlLocalizationProvider language={language}>{children}</XlLocalizationProvider>
    </LocalizationContext.Provider>
  );
};

if (env.isDevelopment) {
  LocalizationProvider.displayName = 'LocalizationProvider';
  LocalizationProvider.propTypes = {
    children: PropTypes.node,
  };
}

export default LocalizationProvider;
