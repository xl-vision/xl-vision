import { Route } from '../types';

const routes: Array<Route> = [
  {
    name: '总览',
    path: '/',
    component: () => import('../../views/hooks/index.zh-CN.mdx'),
  },
];

export default routes;
