import enUS from './en-US';
import zhCN from './zh-CN';
import { Locales } from './types';

export * from './types';

export const locales: Locales = {
  'zh-CN': zhCN,
  'en-US': enUS,
};

export const defaultLanguage = 'en-US';
