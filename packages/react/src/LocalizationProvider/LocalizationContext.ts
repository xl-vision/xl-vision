import React from 'react';
import { Locale } from '../locale';
import locale from '../locale/en-US';

export type LocalizationContextProps = {
  locale: Locale;
  language: string;
};

export default React.createContext<LocalizationContextProps>({
  locale,
  language: 'en-US',
});
