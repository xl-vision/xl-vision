import React from 'react';
import { LocalizationProvider as XlLocalizationProvider } from '@xl-vision/react';
import { isDevelopment } from '@xl-vision/react/utils/env';
import PropTypes from 'prop-types';
import warning from '@xl-vision/react/utils/warning';
import locales, { Locale } from './locales';

export type LocalizationProviderProps = {
  children?: React.ReactNode;
};

export type LocalizationContextProps = {
  lang: string;
  setLang: (lang: string) => void;
  supportLocales: Record<string, Locale>;
  locale: Locale;
};

const defaultLang = 'zh-CN';

export const LocalizationContext = React.createContext<LocalizationContextProps>({
  lang: defaultLang,
  setLang: () => {},
  supportLocales: locales,
  locale: locales[defaultLang],
});

const LocalizationProvider: React.FunctionComponent<LocalizationProviderProps> = (props) => {
  const { children } = props;

  const [lang, setLang] = React.useState(defaultLang);

  const locale = React.useMemo(() => {
    if (locales[lang]) {
      return locales[lang];
    }
    warning(
      true,
      `The specified lang '%s' has no corresponding locale configuration, please provide the corresponding locale file, otherwise the default language (en-US) will be used`,
      lang,
    );
    return locales[defaultLang];
  }, [lang]);

  return (
    <LocalizationContext.Provider value={{ lang, setLang, supportLocales: locales, locale }}>
      <XlLocalizationProvider lang={lang}>{children}</XlLocalizationProvider>
    </LocalizationContext.Provider>
  );
};

if (isDevelopment) {
  LocalizationProvider.displayName = 'LocalizationProvider';
  LocalizationProvider.propTypes = {
    children: PropTypes.node,
  };
}

export default LocalizationProvider;
