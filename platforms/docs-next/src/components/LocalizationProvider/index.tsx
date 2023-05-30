'use client';

import { ThemeProvider } from '@xl-vision/react';
import * as libLocales from '@xl-vision/react/locale';
import { isProduction } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { ReactNode, FC, useMemo } from 'react';
import useLocale from '../../hooks/useLocale';

export type LocalizationProviderProps = {
  children?: ReactNode;
};

const LocalizationProvider: FC<LocalizationProviderProps> = (props) => {
  const { children } = props;

  const { lang } = useLocale();

  const libLocaleKey = useMemo(() => {
    return lang.replace('-', '') as keyof typeof libLocales;
  }, [lang]);

  return <ThemeProvider locale={libLocales[libLocaleKey]}>{children}</ThemeProvider>;
};

if (!isProduction) {
  LocalizationProvider.displayName = 'LocalizationProvider';
  LocalizationProvider.propTypes = {
    children: PropTypes.node,
  };
}

export default LocalizationProvider;
