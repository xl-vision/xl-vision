export type LeafRoute = {
  name: string;
  path: string;
  component?: () => Promise<typeof import('*.mdx')>;
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
    name: '总览1111',
    path: '/',
  },
];

export default route;
