import { LeftRoute, RouteType } from '@docs/routes';

export const getRouteNameMap = (
  routes: Array<RouteType>,
  record: Record<string, LeftRoute> = {},
): Record<string, LeftRoute> => {
  routes.forEach((it) => {
    if ('children' in it) {
      getRouteNameMap(it.children, record);
      return;
    }
    record[it.name] = it;
  });

  return record;
};
