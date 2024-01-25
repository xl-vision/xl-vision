import { Lang } from '../locales';

export type BaseRoute = {
  titleMap: Record<Lang, string>;
};

export type NonLeftRoute = BaseRoute & {
  children: Array<RouteType>;
};

export type LeftRoute = BaseRoute & {
  name: string;
  docs: () => Promise<typeof import('*.mdx?locale')>;
};

export type RouteType = LeftRoute | NonLeftRoute;

export type OmitRouteType<T = RouteType> = T extends LeftRoute
  ? Omit<T, 'docs'>
  : T extends NonLeftRoute
    ? T extends {
        children: Array<infer C>;
      }
      ? Omit<T, 'children'> & {
          children: Array<OmitRouteType<C>>;
        }
      : never
    : never;
