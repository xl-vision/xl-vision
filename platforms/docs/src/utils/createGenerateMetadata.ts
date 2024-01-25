import { Lang } from '@docs/locales';
import { RouteType } from '@docs/routes';
import { getRouteByName } from './route';

export default (routes: Array<RouteType>) => {
  return ({ params: { lang, name } }: { params: { lang: Lang; name: string } }) => {
    const route = getRouteByName(routes, name);

    if (!route) {
      return;
    }

    return {
      title: route.titleMap[lang],
    };
  };
};
