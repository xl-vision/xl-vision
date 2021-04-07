// eslint-disable-next-line unicorn/filename-case
import { Route } from './types';

const routes: Array<Route> = [
  {
    name: 'Overview',
    path: '/',
    component: () => import('../views/index.en-US.mdx'),
  },
  {
    name: 'Getting Start',
    children: [
      {
        name: 'Installation',
        path: '/install',
        component: () => import('../views/quickstart/install.en-US.mdx'),
      },
    ],
  },
  {
    name: 'General',
    children: [
      {
        name: 'Icon',
        path: '/Icon',
        component: () => import('@xl-vision/react/Icon/__doc__/index.en-US.mdx'),
      },
      {
        name: 'Button',
        path: '/Button',
        component: () => import('@xl-vision/react/Button/__doc__/index.en-US.mdx'),
      },
    ],
  },
  {
    name: 'Layout',
    children: [
      {
        name: 'Grid',
        path: '/Row',
        component: () => import('@xl-vision/react/Row/__doc__/index.en-US.mdx'),
      },
    ],
  },
  {
    name: 'Navigation',
    children: [
      {
        name: 'Dropdown',
        path: '/Dropdown',
        component: () => import('@xl-vision/react/Dropdown/__doc__/index.en-US.mdx'),
      },
    ],
  },
  {
    name: 'Data Display',
    children: [
      {
        name: 'Tooltip',
        path: '/Tooltip',
        component: () => import('@xl-vision/react/Tooltip/__doc__/index.en-US.mdx'),
      },
      {
        name: 'Popover',
        path: '/Popover',
        component: () => import('@xl-vision/react/Popover/__doc__/index.en-US.mdx'),
      },
    ],
  },
  {
    name: 'Faceback',
    children: [
      {
        name: 'Popconfirm',
        path: '/Popconfirm',
        component: () => import('@xl-vision/react/Popconfirm/__doc__/index.en-US.mdx'),
      },
    ],
  },
  {
    name: 'Animation',
    children: [
      {
        name: 'Transition',
        path: '/Transition',
        component: () => import('@xl-vision/react/Transition/__doc__/index.en-US.mdx'),
      },
      {
        name: 'CSSTransition',
        path: '/CSSTransition',
        component: () => import('@xl-vision/react/CSSTransition/__doc__/index.en-US.mdx'),
      },
      {
        name: 'TransitionGroup',
        path: '/TransitionGroup',
        component: () => import('@xl-vision/react/TransitionGroup/__doc__/index.en-US.mdx'),
      },
      {
        name: 'CollapseTransition',
        path: '/CollapseTransition',
        component: () => import('@xl-vision/react/CollapseTransition/__doc__/index.en-US.mdx'),
      },
      {
        name: 'Ripple',
        path: '/Ripple',
        component: () => import('@xl-vision/react/Ripple/__doc__/index.en-US.mdx'),
      },
    ],
  },
  {
    name: 'Styles',
    children: [
      {
        name: 'Theme',
        path: '/ThemeProvider',
        component: () => import('@xl-vision/react/ThemeProvider/__doc__/index.en-US.mdx'),
      },
      {
        name: 'CssBaseline',
        path: '/CssBaseline',
        component: () => import('@xl-vision/react/CssBaseline/__doc__/index.en-US.mdx'),
      },
    ],
  },
  {
    name: 'Localization',
    path: '/LocalizationProvider',
    component: () => import('@xl-vision/react/LocalizationProvider/__doc__/index.en-US.mdx'),
  },
  {
    name: 'Basic Component',
    children: [
      {
        name: 'BaseButton',
        path: '/BaseButton',
        component: () => import('@xl-vision/react/BaseButton/__doc__/index.en-US.mdx'),
      },
      {
        name: 'Portal',
        path: '/Portal',
        component: () => import('@xl-vision/react/Portal/__doc__/index.en-US.mdx'),
      },
      {
        name: 'Popper',
        path: '/Popper',
        component: () => import('@xl-vision/react/Popper/__doc__/index.en-US.mdx'),
      },
      {
        name: 'Modal',
        path: '/Modal',
        component: () => import('@xl-vision/react/Modal/__doc__/index.en-US.mdx'),
      },
    ],
  },
];

export default routes;
