import { LeftRoute, OmitRouteType, RouteType } from '@docs/routes';

export const getRouteByName = (
  routes: Array<RouteType>,
  currentName: string,
): LeftRoute | undefined => {
  for (const route of routes) {
    if ('children' in route) {
      const v = getRouteByName(route.children, currentName);
      if (v) {
        return v;
      }
    } else if ('name' in route && route.name === currentName) {
      return route;
    }
  }
};

export const extractRoutes = (routes: Array<RouteType>): Array<OmitRouteType> => {
  return routes.map((it) => {
    if ('children' in it) {
      const children = extractRoutes(it.children);
      return {
        ...it,
        children,
      };
    }
    return {
      name: it.name,
      titleMap: it.titleMap,
    };
  });
};

export const getAllLeftRoute = (routes: Array<RouteType>): Array<LeftRoute> => {
  const array: Array<LeftRoute> = [];
  routes.forEach((it) => {
    if ('children' in it) {
      array.push(...getAllLeftRoute(it.children));
    } else {
      array.push(it);
    }
  });

  return array;
};
