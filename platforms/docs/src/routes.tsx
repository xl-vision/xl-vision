import React from 'react';

export type LeafRoute = {
  name: string;
  path: string;
  component?: () => Promise<{ default: React.ComponentType<any> }>;
};

export type NonLeafRoute = {
  name: string;
  children: Array<Route>;
};

export type Route = LeafRoute | NonLeafRoute;

const route: Array<Route> = [
  {
    name: '总览',
    path: '/',
    component: () => import('./views/index.mdx'),
  },
  {
    name: '通用组件',
    children: [
      {
        name: '图标',
        path: '/Icon',
        component: () => import('@xl-vision/react/Icon/__doc__/index.mdx'),
      },
      {
        name: '按钮',
        path: '/Button',
        component: () => import('@xl-vision/react/Button/__doc__/index.mdx'),
      },
    ],
  },
  {
    name: '布局',
    children: [
      {
        name: '栅格',
        path: '/Row',
        component: () => import('@xl-vision/react/Row/__doc__/index.mdx'),
      },
    ],
  },
  {
    name: '数据展示',
    children: [
      {
        name: '文字提示',
        path: '/Tooltip',
        component: () => import('@xl-vision/react/Tooltip/__doc__/index.mdx'),
      },
      {
        name: '气泡卡片',
        path: '/Popover',
        component: () => import('@xl-vision/react/Popover/__doc__/index.mdx'),
      },
    ],
  },
  {
    name: '反馈',
    children: [
      {
        name: '气泡确认框',
        path: '/Popconfirm',
        component: () => import('@xl-vision/react/Popconfirm/__doc__/index.mdx'),
      },
    ],
  },
  {
    name: '动画',
    children: [
      {
        name: 'Transition',
        path: '/Transition',
        component: () => import('@xl-vision/react/Transition/__doc__/index.mdx'),
      },
      {
        name: 'CSSTransition',
        path: '/CSSTransition',
        component: () => import('@xl-vision/react/CSSTransition/__doc__/index.mdx'),
      },
      {
        name: 'TransitionGroup',
        path: '/TransitionGroup',
        component: () => import('@xl-vision/react/TransitionGroup/__doc__/index.mdx'),
      },
      {
        name: 'CollapseTransition',
        path: '/CollapseTransition',
        component: () => import('@xl-vision/react/CollapseTransition/__doc__/index.mdx'),
      },
      {
        name: 'Ripple',
        path: '/Ripple',
        component: () => import('@xl-vision/react/Ripple/__doc__/index.mdx'),
      },
    ],
  },
  {
    name: '样式',
    children: [
      {
        name: '主题',
        path: '/ThemeProvider',
        component: () => import('@xl-vision/react/ThemeProvider/__doc__/index.mdx'),
      },
      {
        name: 'CssBaseline',
        path: '/CssBaseline',
        component: () => import('@xl-vision/react/CssBaseline/__doc__/index.mdx'),
      },
    ],
  },
  {
    name: '国际化',
    path: '/LocalizationProvider',
    component: () => import('@xl-vision/react/LocalizationProvider/__doc__/index.mdx'),
  },
  {
    name: '基础组件',
    children: [
      {
        name: '基础按钮',
        path: '/BaseButton',
        component: () => import('@xl-vision/react/BaseButton/__doc__/index.mdx'),
      },
      {
        name: 'Portal',
        path: '/Portal',
        component: () => import('@xl-vision/react/Portal/__doc__/index.mdx'),
      },
      {
        name: 'Popper',
        path: '/Popper',
        component: () => import('@xl-vision/react/Popper/__doc__/index.mdx'),
      },
    ],
  },
];

export default route;
