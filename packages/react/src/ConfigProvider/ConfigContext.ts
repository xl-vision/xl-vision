import { createContext } from 'react';
import { defaultLocale, Locale } from '../locale';

export type ConfigContextProps = {
  locale: Locale;
};

export const defaultConfigContext: ConfigContextProps = {
  locale: defaultLocale,
};

export default createContext<ConfigContextProps>(defaultConfigContext);
