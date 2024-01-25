import { RouteType } from './types';

const componentRoutes: Array<RouteType> = [
  {
    titleMap: {
      'en-US': 'Overview',
      'zh-CN': '总览',
    },
    name: 'Overview',
    docs: () => import('@docs/docs/components/Overview/index.en-US.mdx?locale'),
  },
  {
    titleMap: {
      'en-US': 'Color',
      'zh-CN': '色彩',
    },
    name: 'Color',
    docs: () => import('@docs/docs/components/Color/index.en-US.mdx?locale'),
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
        docs: () => import('@docs/docs/components/install/index.en-US.mdx?locale'),
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
        docs: () => import('@docs/docs/components/Icon/index.en-US.mdx?locale'),
      },
      {
        titleMap: {
          'en-US': 'Button',
          'zh-CN': '按钮',
        },
        name: 'Button',
        docs: () => import('@xl-vision/react/src/Button/__doc__/index.en-US.mdx?locale'),
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
        docs: () => import('@xl-vision/react/src/Row/__doc__/index.en-US.mdx?locale'),
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
        docs: () => import('@xl-vision/react/src/Input/__doc__/index.en-US.mdx?locale'),
      },
      {
        titleMap: {
          'en-US': 'Textarea',
          'zh-CN': '多行文本框',
        },
        name: 'Textarea',
        docs: () => import('@xl-vision/react/src/Textarea/__doc__/index.en-US.mdx?locale'),
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
        docs: () => import('@xl-vision/react/src/Dropdown/__doc__/index.en-US.mdx?locale'),
      },
      {
        titleMap: {
          'en-US': 'Affix',
          'zh-CN': '固订',
        },
        name: 'Affix',
        docs: () => import('@xl-vision/react/src/Affix/__doc__/index.en-US.mdx?locale'),
      },
      {
        titleMap: {
          'en-US': 'BackTop',
          'zh-CN': '返回顶部',
        },
        name: 'BackTop',
        docs: () => import('@xl-vision/react/src/BackTop/__doc__/index.en-US.mdx?locale'),
      },
      {
        titleMap: {
          'en-US': 'Anchor',
          'zh-CN': '锚点',
        },
        name: 'Anchor',
        docs: () => import('@xl-vision/react/src/Anchor/__doc__/index.en-US.mdx?locale'),
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
        docs: () => import('@xl-vision/react/src/Tooltip/__doc__/index.en-US.mdx?locale'),
      },
      {
        titleMap: {
          'en-US': 'Popover',
          'zh-CN': '气泡卡片',
        },
        name: 'Popover',
        docs: () => import('@xl-vision/react/src/Popover/__doc__/index.en-US.mdx?locale'),
      },
      {
        titleMap: {
          'en-US': 'Avatar',
          'zh-CN': '头像',
        },
        name: 'Avatar',
        docs: () => import('@xl-vision/react/src/Avatar/__doc__/index.en-US.mdx?locale'),
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
        docs: () => import('@xl-vision/react/src/Popconfirm/__doc__/index.en-US.mdx?locale'),
      },
      {
        titleMap: {
          'en-US': 'Dialog',
          'zh-CN': '对话框',
        },
        name: 'Dialog',
        docs: () => import('@xl-vision/react/src/Dialog/__doc__/index.en-US.mdx?locale'),
      },
      {
        titleMap: {
          'en-US': 'Message',
          'zh-CN': '消息提醒',
        },
        name: 'Message',
        docs: () => import('@xl-vision/react/src/Message/__doc__/index.en-US.mdx?locale'),
      },
      {
        titleMap: {
          'en-US': 'Notication',
          'zh-CN': '消息提醒框',
        },
        name: 'Notication',
        docs: () => import('@xl-vision/react/src/Notication/__doc__/index.en-US.mdx?locale'),
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
        docs: () => import('@xl-vision/react/src/Transition/__doc__/index.en-US.mdx?locale'),
      },
      {
        titleMap: {
          'en-US': 'TransitionGroup',
          'zh-CN': '过渡动画组',
        },
        name: 'TransitionGroup',
        docs: () => import('@xl-vision/react/src/TransitionGroup/__doc__/index.en-US.mdx?locale'),
      },
      {
        titleMap: {
          'en-US': 'CollapseTransition',
          'zh-CN': '折叠动画',
        },
        name: 'CollapseTransition',
        docs: () =>
          import('@xl-vision/react/src/CollapseTransition/__doc__/index.en-US.mdx?locale'),
      },
      {
        titleMap: {
          'en-US': 'Ripple',
          'zh-CN': '水波纹动画',
        },
        name: 'Ripple',
        docs: () => import('@xl-vision/react/src/Ripple/__doc__/index.en-US.mdx?locale'),
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
        docs: () => import('@xl-vision/react/src/ThemeProvider/__doc__/index.en-US.mdx?locale'),
      },
      {
        titleMap: {
          'en-US': 'CssBaseline',
          'zh-CN': 'CSS基线',
        },
        name: 'CssBaseline',
        docs: () => import('@xl-vision/react/src/CssBaseline/__doc__/index.en-US.mdx?locale'),
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
        docs: () => import('@xl-vision/react/src/BaseButton/__doc__/index.en-US.mdx?locale'),
      },
      {
        titleMap: {
          'en-US': 'Portal',
          'zh-CN': '门户',
        },
        name: 'Portal',
        docs: () => import('@xl-vision/react/src/Portal/__doc__/index.en-US.mdx?locale'),
      },
      {
        titleMap: {
          'en-US': 'Popper',
          'zh-CN': '基础弹出框',
        },
        name: 'Popper',
        docs: () => import('@xl-vision/react/src/Popper/__doc__/index.en-US.mdx?locale'),
      },
      {
        titleMap: {
          'en-US': 'Modal',
          'zh-CN': '模态框',
        },
        name: 'Modal',
        docs: () => import('@xl-vision/react/src/Modal/__doc__/index.en-US.mdx?locale'),
      },
      {
        titleMap: {
          'en-US': 'ResizeObserver',
          'zh-CN': '尺寸观察',
        },
        name: 'ResizeObserver',
        docs: () => import('@xl-vision/react/src/ResizeObserver/__doc__/index.en-US.mdx?locale'),
      },
    ],
  },
];

export default componentRoutes;
