import React from 'react';
import { defaultLanguage, defaultLocale, Locale } from '../locale';

export type ConfigContextProps = {
  locale: Locale;
  language: string;
};

export const defaultConfigContext: ConfigContextProps = {
  locale: defaultLocale,
  language: defaultLanguage,
};

export default React.createContext<ConfigContextProps>(defaultConfigContext);
