import { isProduction } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { ReactNode, FC, useMemo } from 'react';
import ConfigContext from './ConfigContext';
import { defaultLocale, Locale } from '../locale';

export type ConfigProviderProps = {
  children: ReactNode;
  locale?: Locale;
};

const ConfigProvider: FC<ConfigProviderProps> = (props) => {
  const { locale = defaultLocale, children } = props;

  const memorizedValue = useMemo(() => {
    return {
      locale,
    };
  }, [locale]);

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
