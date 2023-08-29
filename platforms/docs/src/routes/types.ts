import { Lang } from '../locales';

export type BaseRoute = {
  titleMap: Record<Lang, string>;
};

export type NonLeftRoute = BaseRoute & {
  children: Array<RouteType>;
};

export type LeftRoute = BaseRoute & {
  name: string;
  // docs: () => Promise<typeof import('*.mdx?locale')>;
};

export type RouteType = LeftRoute | NonLeftRoute;
