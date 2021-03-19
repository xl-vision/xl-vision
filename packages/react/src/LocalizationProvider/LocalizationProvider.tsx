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
  const { customLocales, lang = 'en-US', children } = props;

  const memorizedValue = React.useMemo(() => {
    let locale = customLocales?.[lang] || locales[lang];

    warning(
      !locale,
      `The specified lang '%s' has no corresponding locale configuration, please provide the corresponding locale file, otherwise the default language (en-US) will be used`,
      lang,
    );
    locale = locales['en-US'];

    return { locale, lang };
  }, [customLocales, lang]);

  return (
    <LocalizationContext.Provider value={memorizedValue}>{children}</LocalizationContext.Provider>
  );
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
