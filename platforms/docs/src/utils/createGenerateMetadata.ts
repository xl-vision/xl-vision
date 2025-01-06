import { Lang } from '@docs/locales';
import { RouteType } from '@docs/routes';
import { getRouteByName } from './route';

export default (routes: Array<RouteType>) => {
  return async ({ params }: { params: Promise<{ lang: Lang; name: string }> }) => {
    const { lang, name } = await params;

    const route = getRouteByName(routes, name);

    if (!route) {
      return;
    }

    return {
      title: route.titleMap[lang],
    };
  };
};
