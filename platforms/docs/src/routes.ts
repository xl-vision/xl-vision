export type BaseRoute = {
  titleMap: {
    'zh-CN': string;
    'en-US': string;
  };
};

export type NonLeftRoute = BaseRoute & {
  children: Array<RouteType>;
};

export type LeftRoute = BaseRoute & {
  path: string;
};

export type RouteType = LeftRoute | NonLeftRoute;

export type Route = {
  components: Array<RouteType>;
  hooks: Array<RouteType>;
};

const route: Route = {
  components: [
    {
      titleMap: {
        'en-US': 'Overview',
        'zh-CN': '总览',
      },
      path: '/',
    },
    {
      titleMap: {
        'en-US': 'Getting Start',
        'zh-CN': '快速上手',
      },
      children: [
        {
          titleMap: {
            'en-US': 'Installation',
            'zh-CN': '安装',
          },
          path: '/install',
        },
      ],
    },
    {
      titleMap: {
        'en-US': 'General',
        'zh-CN': '通用组件',
      },
      children: [
        {
          titleMap: {
            'en-US': 'Icon',
            'zh-CN': '图标',
          },
          path: '/Icon',
        },
        {
          titleMap: {
            'en-US': 'Button',
            'zh-CN': '按钮',
          },
          path: '/Button',
        },
      ],
    },
    {
      titleMap: {
        'en-US': 'Layout',
        'zh-CN': '布局',
      },
      children: [
        {
          titleMap: {
            'en-US': 'Grid',
            'zh-CN': '栅格',
          },
          path: '/Row',
        },
      ],
    },
    {
      titleMap: {
        'en-US': 'Form',
        'zh-CN': '表单',
      },
      children: [
        {
          titleMap: {
            'en-US': 'Input',
            'zh-CN': '输入框',
          },
          path: '/Input',
        },
        {
          titleMap: {
            'en-US': 'TextArea',
            'zh-CN': '多行文本框',
          },
          path: '/TextArea',
        },
      ],
    },
    {
      titleMap: {
        'en-US': 'Navigation',
        'zh-CN': '导航',
      },
      children: [
        {
          titleMap: {
            'en-US': 'Dropdown',
            'zh-CN': '下拉框',
          },
          path: '/Dropdown',
        },
        {
          titleMap: {
            'en-US': 'Affix',
            'zh-CN': '固订',
          },
          path: '/Affix',
        },
      ],
    },
    {
      titleMap: {
        'en-US': 'Data Display',
        'zh-CN': '数据展示',
      },
      children: [
        {
          titleMap: {
            'en-US': 'Tooltip',
            'zh-CN': '文字提示',
          },
          path: '/Tooltip',
        },
        {
          titleMap: {
            'en-US': 'Popover',
            'zh-CN': '气泡卡片',
          },
          path: '/Popover',
        },
        {
          titleMap: {
            'en-US': 'Avatar',
            'zh-CN': '头像',
          },
          path: '/Avatar',
        },
      ],
    },
    {
      titleMap: {
        'en-US': 'Faceback',
        'zh-CN': '反馈',
      },
      children: [
        {
          titleMap: {
            'en-US': 'Popconfirm',
            'zh-CN': '气泡确认框',
          },
          path: '/Popconfirm',
        },
        {
          titleMap: {
            'en-US': 'Dialog',
            'zh-CN': '对话框',
          },
          path: '/Dialog',
        },
      ],
    },
    {
      titleMap: {
        'en-US': 'Animation',
        'zh-CN': '动画',
      },
      children: [
        {
          titleMap: {
            'en-US': 'Transition',
            'zh-CN': 'Transition',
          },
          path: '/Transition',
        },
        {
          titleMap: {
            'en-US': 'CssTransition',
            'zh-CN': 'CSS过渡动画',
          },
          path: '/CssTransition',
        },
        {
          titleMap: {
            'en-US': 'Transition Group',
            'zh-CN': 'TransitionGroup',
          },
          path: '/TransitionGroup',
        },
        {
          titleMap: {
            'en-US': 'Collapse Transition',
            'zh-CN': '折叠动画',
          },
          path: '/CollapseTransition',
        },
        {
          titleMap: {
            'en-US': 'Ripple',
            'zh-CN': '水波纹动画',
          },
          path: '/Ripple',
        },
      ],
    },
    {
      titleMap: {
        'en-US': 'Styles',
        'zh-CN': '样式',
      },
      children: [
        {
          titleMap: {
            'en-US': 'Theme',
            'zh-CN': '主题',
          },
          path: '/ThemeProvider',
        },
        {
          titleMap: {
            'en-US': 'CssBaseline',
            'zh-CN': 'CSS基线',
          },
          path: '/CssBaseline',
        },
      ],
    },
    {
      titleMap: {
        'en-US': 'Global Config',
        'zh-CN': '全局配置',
      },
      path: '/ConfigProvider',
    },
    {
      titleMap: {
        'en-US': 'Basic Component',
        'zh-CN': '基础组件',
      },
      children: [
        {
          titleMap: {
            'en-US': 'Base Button',
            'zh-CN': '基础按钮',
          },
          path: '/BaseButton',
        },
        {
          titleMap: {
            'en-US': 'Portal',
            'zh-CN': 'Portal',
          },
          path: '/Portal',
        },
        {
          titleMap: {
            'en-US': 'Popper',
            'zh-CN': '基础弹出框',
          },
          path: '/Popper',
        },
        {
          titleMap: {
            'en-US': 'Modal',
            'zh-CN': '模态框',
          },
          path: '/Modal',
        },
        {
          titleMap: {
            'en-US': 'ResizeObserver',
            'zh-CN': 'ResizeObserver',
          },
          path: '/ResizeObserver',
        },
      ],
    },
  ],
  hooks: [],
};

export default route;
