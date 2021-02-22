import React from 'react';
import PropTypes from 'prop-types';
import locales, { Locales } from '../locale';
import { isDevelopment } from '../utils/env';
import warning from '../utils/warning';
import LocalizationContext from './LocalizationContext';

export type LocalizationProviderProps = {
  customLocales?: Locales;
  lang: string;
  children: React.ReactNode;
};

const LocalizationProvider: React.FunctionComponent<LocalizationProviderProps> = (props) => {
  const { customLocales = {}, lang = 'en-US', children } = props;

  const locale = React.useMemo(() => {
    if (customLocales[lang]) {
      return customLocales[lang];
    }
    if (locales[lang]) {
      return locales[lang];
    }
    warning(
      true,
      `The specified lang '%s' has no corresponding locale configuration, please provide the corresponding locale file, otherwise the default language (en-US) will be used`,
      lang,
    );
    return locales['en-US'];
  }, [customLocales, lang]);
  return <LocalizationContext.Provider value={{ locale }}>{children}</LocalizationContext.Provider>;
};

if (isDevelopment) {
  LocalizationProvider.displayName = 'LocalizationProvider';

  LocalizationProvider.propTypes = {
    customLocales: PropTypes.shape({}),
    lang: PropTypes.string.isRequired,
    children: PropTypes.node,
  };
}

export default LocalizationProvider;
