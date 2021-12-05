export type Locale = {
  name: string;
  header: {
    themeTooltip: string;
    githubTooltip: string;
    component: string;
    hooks: string;
    index: string;
  };
  sponsorship: {
    title: string;
  };
  layout: {
    component: {
      mobileAsideButton: string;
    };
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
    404: {
      link: string;
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
    sponsorship: {
      title: '赞助方',
    },
    layout: {
      component: {
        mobileAsideButton: '菜单',
      },
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
      404: {
        link: '返回首页',
      },
    },
  },
  'en-US': {
    name: 'English',
    header: {
      themeTooltip: 'Switch between light mode and dark mode',
      githubTooltip: 'Github',
      component: 'Component',
      hooks: 'React Hooks',
      index: 'Home',
    },
    sponsorship: {
      title: 'Our sponsors',
    },
    layout: {
      component: {
        mobileAsideButton: 'Menus',
      },
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
      404: {
        link: 'Return Home Page',
      },
    },
  },
};

export default locales;
