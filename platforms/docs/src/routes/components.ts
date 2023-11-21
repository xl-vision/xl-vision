import { RouteType } from './types';

const componentRoutes: Array<RouteType> = [
  {
    titleMap: {
      'en-US': 'Overview',
      'zh-CN': '总览',
    },
    name: '',
  },
  {
    titleMap: {
      'en-US': 'Color',
      'zh-CN': '色彩',
    },
    name: 'Color',
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
        name: 'install',
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
        name: 'Icon',
      },
      {
        titleMap: {
          'en-US': 'Button',
          'zh-CN': '按钮',
        },
        name: 'Button',
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
        name: 'Row',
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
        name: 'Input',
      },
      {
        titleMap: {
          'en-US': 'Textarea',
          'zh-CN': '多行文本框',
        },
        name: 'Textarea',
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
        name: 'Dropdown',
      },
      {
        titleMap: {
          'en-US': 'Affix',
          'zh-CN': '固订',
        },
        name: 'Affix',
      },
      {
        titleMap: {
          'en-US': 'BackTop',
          'zh-CN': '返回顶部',
        },
        name: 'BackTop',
      },
      {
        titleMap: {
          'en-US': 'Anchor',
          'zh-CN': '锚点',
        },
        name: 'Anchor',
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
        name: 'Tooltip',
      },
      {
        titleMap: {
          'en-US': 'Popover',
          'zh-CN': '气泡卡片',
        },
        name: 'Popover',
      },
      {
        titleMap: {
          'en-US': 'Avatar',
          'zh-CN': '头像',
        },
        name: 'Avatar',
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
        name: 'Popconfirm',
      },
      {
        titleMap: {
          'en-US': 'Dialog',
          'zh-CN': '对话框',
        },
        name: 'Dialog',
      },
      {
        titleMap: {
          'en-US': 'Message',
          'zh-CN': '消息提醒',
        },
        name: 'Message',
      },
      {
        titleMap: {
          'en-US': 'Notication',
          'zh-CN': '消息提醒框',
        },
        name: 'Notication',
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
        name: 'Transition',
      },
      {
        titleMap: {
          'en-US': 'TransitionGroup',
          'zh-CN': '过渡动画组',
        },
        name: 'TransitionGroup',
      },
      {
        titleMap: {
          'en-US': 'CollapseTransition',
          'zh-CN': '折叠动画',
        },
        name: 'CollapseTransition',
      },
      {
        titleMap: {
          'en-US': 'Ripple',
          'zh-CN': '水波纹动画',
        },
        name: 'Ripple',
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
        name: 'ThemeProvider',
      },
      {
        titleMap: {
          'en-US': 'CssBaseline',
          'zh-CN': 'CSS基线',
        },
        name: 'CssBaseline',
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
        name: 'BaseButton',
      },
      {
        titleMap: {
          'en-US': 'Portal',
          'zh-CN': '门户',
        },
        name: 'Portal',
      },
      {
        titleMap: {
          'en-US': 'Popper',
          'zh-CN': '基础弹出框',
        },
        name: 'Popper',
      },
      {
        titleMap: {
          'en-US': 'Modal',
          'zh-CN': '模态框',
        },
        name: 'Modal',
      },
      {
        titleMap: {
          'en-US': 'ResizeObserver',
          'zh-CN': '尺寸观察',
        },
        name: 'ResizeObserver',
      },
    ],
  },
];

export default componentRoutes;
