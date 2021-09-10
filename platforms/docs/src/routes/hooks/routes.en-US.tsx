import { Route } from '../types';

const routes: Array<Route> = [
  {
    name: 'Overview',
    path: '/',
    component: () => import('../../views/hooks/index.en-US.mdx'),
  },
];

export default routes;
