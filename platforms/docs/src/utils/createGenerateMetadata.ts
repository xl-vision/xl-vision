import { Lang } from '@docs/locales';
import { LeftRoute, RouteType } from '@docs/routes';

export default (routes: Array<RouteType>, currentName: string) => {
  const route = getRouteByName(routes, currentName);

  return ({ params: { lang } }: { params: { lang: Lang } }) => {
    if (!route) {
      return;
    }

    return {
      title: route.titleMap[lang],
    };
  };
};

const getRouteByName = (routes: Array<RouteType>, currentName: string): LeftRoute | undefined => {
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];

    if ('children' in route) {
      const v = getRouteByName(route.children, currentName);
      if (v) {
        return v;
      }
    } else if ('name' in route) {
      if (route.name === currentName) {
        return route;
      }
    }
  }
};
