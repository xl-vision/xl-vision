import React from 'react';
import PropTypes from 'prop-types';
import { isProduction } from '@xl-vision/utils';
import ConfigContext, { defaultConfigContext } from './ConfigContext';
import { defaultLanguage, locales, Locales } from '../locale';
import warning from '../utils/warning';

export type ConfigProviderProps = {
  children: React.ReactNode;
  customLocales?: Locales;
  language?: string;
};

const ConfigProvider: React.FunctionComponent<ConfigProviderProps> = (props) => {
  const { customLocales, language, children } = {
    ...defaultConfigContext,
    ...props,
  };

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
    // eslint-disable-next-line react/no-unused-prop-types
    children: PropTypes.node.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    language: PropTypes.string,
    // eslint-disable-next-line react/no-unused-prop-types
    customLocales: PropTypes.objectOf(PropTypes.any),
  };
}

export default ConfigProvider;
