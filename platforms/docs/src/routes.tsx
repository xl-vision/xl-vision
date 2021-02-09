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
        name: 'CollapseTransition',
        path: '/CollapseTransition',
        component: () => import('@xl-vision/react/CollapseTransition/__doc__/index.mdx'),
      },
    ],
  },
];

export default route;
