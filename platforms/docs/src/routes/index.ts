import components from './components';
import hooks from './hooks';
import { Route } from './types';

export * from './types';

const routes: Record<string, Record<string, Array<Route>>> = {
  components,
  hooks,
  index: {
    'zh-CN': [
      {
        name: 'Overview',
        path: '/',
        component: () => import('../views/index.zh-CN'),
      },
    ],
    'en-US': [
      {
        name: 'Overview',
        path: '/',
        component: () => import('../views/index.en-US'),
      },
    ],
  },
};

export default routes;
