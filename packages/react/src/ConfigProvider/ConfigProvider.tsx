import React from 'react';
import PropTypes from 'prop-types';
import { isProduction, warning } from '@xl-vision/utils';
import ConfigContext, { defaultConfigContext } from './ConfigContext';
import { defaultLanguage, locales, Locales } from '../locale';

export type ConfigProviderProps = {
  children: React.ReactNode;
  customLocales?: Locales;
  language?: string;
};

const ConfigProvider: React.FunctionComponent<ConfigProviderProps> = (props) => {
  const { customLocales, language = defaultConfigContext.language, children } = props;

  const memorizedValue = React.useMemo(() => {
    let actualLanguage = language;
    let actualLocale = customLocales?.[actualLanguage] || locales[actualLanguage];

    if (!actualLocale) {
      warning(
        true,
        `The specified lang '%s' has no corresponding locale configuration, please provide the corresponding locale file, otherwise the default language (en-US) will be used`,
        actualLanguage,
      );
      actualLocale = locales[defaultLanguage];
      actualLanguage = defaultLanguage;
    }
    return {
      locale: actualLocale,
      language: actualLanguage,
    };
  }, [language, customLocales]);

  return <ConfigContext.Provider value={memorizedValue}>{children}</ConfigContext.Provider>;
};

if (!isProduction) {
  ConfigProvider.displayName = 'ConfigProvider';

  ConfigProvider.propTypes = {
    children: PropTypes.node.isRequired,
    language: PropTypes.string,
    customLocales: PropTypes.objectOf(PropTypes.any),
  };
}

export default ConfigProvider;
