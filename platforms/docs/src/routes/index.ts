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
        name: '首页',
        path: '/',
        layout: 'empty',
        component: () => import('../views/index'),
      },
      {
        name: '404',
        path: '/**',
        layout: 'empty',
        component: () => import('../views/404'),
      },
    ],
    'en-US': [
      {
        name: 'Index',
        path: '/',
        layout: 'empty',
        component: () => import('../views/index'),
      },
      {
        name: '404',
        path: '/**',
        layout: 'empty',
        component: () => import('../views/404'),
      },
    ],
  },
};

export default routes;
