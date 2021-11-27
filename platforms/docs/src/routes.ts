export type BaseRoute = {
  titleMap: Record<string, string>;
};

export type NonLeftRoute = BaseRoute & {
  children: Array<RouteType>;
};

export type LeftRoute = BaseRoute & {
  path: string;
};

export type RouteType = LeftRoute | NonLeftRoute;

export type Route = {
  components: Array<RouteType>;
  hooks: Array<RouteType>;
};

const route: Route = {
  components: [
    {
      titleMap: {
        'en-US': 'Overview',
        'zh-CN': '总览',
      },
      path: '/',
    },
  ],
  hooks: [],
};

export default route;
