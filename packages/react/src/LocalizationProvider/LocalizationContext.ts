import React from 'react';
import { Locale, defaultLocale } from '../locale';

export type LocalizationContextProps = {
  locale: Locale;
  language: string;
};

export default React.createContext<LocalizationContextProps>({
  locale: defaultLocale,
  language: 'en-US',
});
