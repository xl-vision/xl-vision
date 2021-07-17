// eslint-disable-next-line unicorn/filename-case
import { Route } from '../types';

const routes: Array<Route> = [
  {
    name: 'Overview',
    path: '/',
    component: () => import('../../views/editor/index.en-US.mdx'),
  },
];

export default routes;
