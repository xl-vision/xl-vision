import { createContext } from 'react';
import { defaultLocale, Locale } from '../locale';
import { ComponentSize } from '../ThemeProvider';

export type ConfigContextProps = {
  locale: Locale;
  size: ComponentSize;
  clsPrefix: string;
};

export const defaultConfigContext: ConfigContextProps = {
  locale: defaultLocale,
  size: 'middle',
  clsPrefix: 'xl',
};

export default createContext<ConfigContextProps>(defaultConfigContext);
