import enUS from './en-US';
import { Locales } from './types';
import zhCN from './zh-CN';

export * from './types';

export const locales: Locales = {
  'zh-CN': zhCN,
  'en-US': enUS,
};

export const defaultLanguage = 'en-US';

export const defaultLocale = locales[defaultLanguage];
