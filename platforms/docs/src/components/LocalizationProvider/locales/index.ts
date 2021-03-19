export type Locale = {
  name: string;
  header: {
    langTooltip: string;
  };
};

const locales: Record<string, Locale> = {
  'zh-CN': {
    name: '中文',
    header: {
      langTooltip: '切换语言',
    },
  },
  'en-US': {
    name: 'English',
    header: {
      langTooltip: 'switch language',
    },
  },
};

export default locales;
