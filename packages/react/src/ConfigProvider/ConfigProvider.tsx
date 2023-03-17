import { isProduction } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { ReactNode, FC, useMemo } from 'react';
import ConfigContext, { ConfigContextProps } from './ConfigContext';
import useConfig from './useConfig';

export type ConfigProviderProps = Partial<ConfigContextProps> & {
  children: ReactNode;
};

const ConfigProvider: FC<ConfigProviderProps> = (props) => {
  const { locale, size, clsPrefix, children } = props;

  const parentConfig = useConfig();

  const memorizedValue = useMemo(() => {
    const config = { ...parentConfig };

    if (locale) {
      config.locale = locale;
    }

    if (clsPrefix) {
      config.clsPrefix = clsPrefix;
    }

    if (size) {
      config.size = size;
    }

    return config;
  }, [locale, size, clsPrefix, parentConfig]);

  return <ConfigContext.Provider value={memorizedValue}>{children}</ConfigContext.Provider>;
};

if (!isProduction) {
  ConfigProvider.displayName = 'ConfigProvider';

  ConfigProvider.propTypes = {
    children: PropTypes.node.isRequired,
    locale: PropTypes.shape({}),
  };
}

export default ConfigProvider;
