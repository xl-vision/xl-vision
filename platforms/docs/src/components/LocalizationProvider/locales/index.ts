export type Locale = {
  name: string;
  header: {
    themeTooltip: string;
    githubTooltip: string;
  };
};

const locales: Record<string, Locale> = {
  'zh-CN': {
    name: '中文',
    header: {
      themeTooltip: '在亮色主题和暗色主题间切换',
      githubTooltip: 'Github',
    },
  },
  'en-US': {
    name: 'English',
    header: {
      themeTooltip: 'Switch between light mode and dark mode',
      githubTooltip: 'Github',
    },
  },
};

export default locales;
