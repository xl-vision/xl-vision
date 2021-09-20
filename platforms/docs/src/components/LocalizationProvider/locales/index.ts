export type Locale = {
  name: string;
  header: {
    themeTooltip: string;
    githubTooltip: string;
    component: string;
    hooks: string;
    index: string;
  };
  pages: {
    index: {
      desc: string;
      btnStart: string;
      btnGithub: string;
    };
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
      component: '组件',
      hooks: 'React Hooks',
      index: '首页',
    },
    pages: {
      index: {
        desc: '不可错过的React组件库',
        btnStart: '开始使用',
        btnGithub: 'Github',
      },
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
      component: 'component',
      hooks: 'React Hooks',
      index: 'index',
    },
    pages: {
      index: {
        desc: 'React component library not to be missed',
        btnStart: 'Get Started',
        btnGithub: 'Github',
      },
      Icons: {
        seachPlaceholder: 'Seach icon here',
      },
    },
  },
};

export default locales;
