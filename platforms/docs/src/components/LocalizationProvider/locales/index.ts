export type Locale = {
  name: string;
  header: {
    themeTooltip: string;
    githubTooltip: string;
  };
  pages: {
    Icons: {
      seachPlaceholder: string;
    };
  };
};

const locales: Record<string, Locale> = {
  'zh-CN': {
    name: '中文',
    header: {
      themeTooltip: '在亮色主题和暗色主题间切换',
      githubTooltip: 'Github',
    },
    pages: {
      Icons: {
        seachPlaceholder: '在这里搜索图标',
      },
    },
  },
  'en-US': {
    name: 'English',
    header: {
      themeTooltip: 'Switch between light mode and dark mode',
      githubTooltip: 'Github',
    },
    pages: {
      Icons: {
        seachPlaceholder: 'Seach icon here',
      },
    },
  },
};

export default locales;
