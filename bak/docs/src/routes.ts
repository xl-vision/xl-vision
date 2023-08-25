export type BaseRoute = {
  titleMap: {
    'en-US': string;
    'zh-CN': string;
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
        'en-US': 'Color',
        'zh-CN': '色彩',
      },
      path: '/Color',
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
            'en-US': 'Textarea',
            'zh-CN': '多行文本框',
          },
          path: '/Textarea',
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
        {
          titleMap: {
            'en-US': 'BackTop',
            'zh-CN': '返回顶部',
          },
          path: '/BackTop',
        },
        {
          titleMap: {
            'en-US': 'Anchor',
            'zh-CN': '锚点',
          },
          path: '/Anchor',
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
        {
          titleMap: {
            'en-US': 'Message',
            'zh-CN': '消息提醒',
          },
          path: '/Message',
        },
        {
          titleMap: {
            'en-US': 'Notication',
            'zh-CN': '消息提醒框',
          },
          path: '/Notication',
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
            'zh-CN': '过渡动画',
          },
          path: '/Transition',
        },
        {
          titleMap: {
            'en-US': 'TransitionGroup',
            'zh-CN': '过渡动画组',
          },
          path: '/TransitionGroup',
        },
        {
          titleMap: {
            'en-US': 'CollapseTransition',
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
        'en-US': 'Basic Component',
        'zh-CN': '基础组件',
      },
      children: [
        {
          titleMap: {
            'en-US': 'BaseButton',
            'zh-CN': '基础按钮',
          },
          path: '/BaseButton',
        },
        {
          titleMap: {
            'en-US': 'Portal',
            'zh-CN': '门户',
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
            'zh-CN': '尺寸观察',
          },
          path: '/ResizeObserver',
        },
      ],
    },
  ],
  hooks: [
    {
      titleMap: {
        'en-US': 'Overview',
        'zh-CN': '总览',
      },
      path: '/',
    },
    {
      titleMap: {
        'en-US': 'useTransition',
        'zh-CN': 'useTransition',
      },
      path: '/useTransition',
    },
    {
      titleMap: {
        'en-US': 'useCssTransition',
        'zh-CN': 'useCssTransition',
      },
      path: '/useCssTransition',
    },
    {
      titleMap: {
        'en-US': 'usePopper',
        'zh-CN': 'usePopper',
      },
      path: '/usePopper',
    },
    {
      titleMap: {
        'en-US': 'useNotication',
        'zh-CN': 'useNotication',
      },
      path: '/useNotication',
    },
    {
      titleMap: {
        'en-US': 'useForm',
        'zh-CN': 'useForm',
      },
      path: '/useForm',
    },
  ],
};

export default route;
