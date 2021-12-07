import { defaultLanguage } from '@xl-vision/react/locale';
import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useLocale } from '../LocalizationProvider';
import routes, { Route, RouteType } from '../../routes';

export type DocsProps = {
  locales: Record<string, React.ComponentType>;
};

const visitRoute = (
  baseName: keyof Route,
  routeTypes: Array<RouteType>,
  map: Record<string, Record<string, string>>,
) => {
  routeTypes.forEach((route) => {
    if ('children' in route) {
      visitRoute(baseName, route.children, map);
      return;
    }
    const { titleMap, path } = route;
    const fullpath = `/${baseName}${path}`.replace(/(.+)\/$/, '$1');

    map[fullpath] = titleMap;
  });
};

const routeMap: Record<string, Record<string, string>> = {};

Object.keys(routes).forEach((baseName) => {
  const name = baseName as keyof Route;
  const route = routes[name];
  visitRoute(name, route, routeMap);
});

const Docs: React.FunctionComponent<DocsProps> = ({ locales }) => {
  const { language } = useLocale();

  const { pathname } = useRouter();

  const titleMap = routeMap[pathname];

  const title = titleMap[language] || titleMap[defaultLanguage];

  const Component = locales[language] || locales[defaultLanguage];

  const Instance = Component ? <Component /> : null;

  return (
    <>
      <Head>{title && <title>{title} | xl-vision</title>}</Head>
      {Instance}
    </>
  );
};

export default Docs;
