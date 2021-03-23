// eslint-disable-next-line unicorn/filename-case
import { Route } from './types';

const routes: Array<Route> = [
  {
    name: '总览',
    path: '/',
    component: () => import('../views/index.zh-CN.mdx'),
  },
  {
    name: '快速上手',
    children: [
      {
        name: '安装',
        path: '/install',
        component: () => import('../views/quickstart/install.zh-CN.mdx'),
      },
    ],
  },
  {
    name: '通用组件',
    children: [
      {
        name: '图标',
        path: '/Icon',
        component: () => import('@xl-vision/react/Icon/__doc__/index.zh-CN.mdx'),
      },
      {
        name: '按钮',
        path: '/Button',
        component: () => import('@xl-vision/react/Button/__doc__/index.zh-CN.mdx'),
      },
    ],
  },
  {
    name: '布局',
    children: [
      {
        name: '栅格',
        path: '/Row',
        component: () => import('@xl-vision/react/Row/__doc__/index.zh-CN.mdx'),
      },
    ],
  },
  {
    name: '导航',
    children: [
      {
        name: '下拉框',
        path: '/Dropdown',
        component: () => import('@xl-vision/react/Dropdown/__doc__/index.zh-CN.mdx'),
      },
    ],
  },
  {
    name: '数据展示',
    children: [
      {
        name: '文字提示',
        path: '/Tooltip',
        component: () => import('@xl-vision/react/Tooltip/__doc__/index.zh-CN.mdx'),
      },
      {
        name: '气泡卡片',
        path: '/Popover',
        component: () => import('@xl-vision/react/Popover/__doc__/index.zh-CN.mdx'),
      },
    ],
  },
  {
    name: '反馈',
    children: [
      {
        name: '气泡确认框',
        path: '/Popconfirm',
        component: () => import('@xl-vision/react/Popconfirm/__doc__/index.zh-CN.mdx'),
      },
      {
        name: '对话框',
        path: '/Modal',
        component: () => import('@xl-vision/react/Modal/__doc__/index.zh-CN.mdx'),
      },
    ],
  },
  {
    name: '动画',
    children: [
      {
        name: '过渡动画',
        path: '/Transition',
        component: () => import('@xl-vision/react/Transition/__doc__/index.zh-CN.mdx'),
      },
      {
        name: 'CSS过渡动画',
        path: '/CSSTransition',
        component: () => import('@xl-vision/react/CSSTransition/__doc__/index.zh-CN.mdx'),
      },
      {
        name: '过渡动画组',
        path: '/TransitionGroup',
        component: () => import('@xl-vision/react/TransitionGroup/__doc__/index.zh-CN.mdx'),
      },
      {
        name: '折叠动画',
        path: '/CollapseTransition',
        component: () => import('@xl-vision/react/CollapseTransition/__doc__/index.zh-CN.mdx'),
      },
      {
        name: '水波纹动画',
        path: '/Ripple',
        component: () => import('@xl-vision/react/Ripple/__doc__/index.zh-CN.mdx'),
      },
    ],
  },
  {
    name: '样式',
    children: [
      {
        name: '主题',
        path: '/ThemeProvider',
        component: () => import('@xl-vision/react/ThemeProvider/__doc__/index.zh-CN.mdx'),
      },
      {
        name: 'CSS基线',
        path: '/CssBaseline',
        component: () => import('@xl-vision/react/CssBaseline/__doc__/index.zh-CN.mdx'),
      },
    ],
  },
  {
    name: '国际化',
    path: '/LocalizationProvider',
    component: () => import('@xl-vision/react/LocalizationProvider/__doc__/index.zh-CN.mdx'),
  },
  {
    name: '基础组件',
    children: [
      {
        name: '基础按钮',
        path: '/BaseButton',
        component: () => import('@xl-vision/react/BaseButton/__doc__/index.zh-CN.mdx'),
      },
      {
        name: 'Portal',
        path: '/Portal',
        component: () => import('@xl-vision/react/Portal/__doc__/index.zh-CN.mdx'),
      },
      {
        name: '基础弹出框',
        path: '/Popper',
        component: () => import('@xl-vision/react/Popper/__doc__/index.zh-CN.mdx'),
      },
    ],
  },
];

export default routes;
