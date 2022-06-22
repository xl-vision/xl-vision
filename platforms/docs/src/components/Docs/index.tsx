import { defaultLanguage } from '@xl-vision/react/locale';
import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useConstantFn } from '@xl-vision/hooks';
import { Anchor, Row } from '@xl-vision/react';
import { useLocale } from '../LocalizationProvider';
import routes, { Route, RouteType } from '../../routes';
import { height } from '../Header';
import useIsDebugMode from '../../hooks/useIsDebugMode';

export type DocsProps = {
  locales: Record<string, { component: React.ComponentType; outlinePromise: Promise<Outline> }>;
};

export type Outline = Array<{
  id: string;
  title: string;
  children: Outline;
  debug?: boolean;
}>;

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

const Docs: React.FC<DocsProps> = ({ locales }) => {
  const { language } = useLocale();

  const { pathname } = useRouter();

  const [outline, setOutline] = React.useState<Outline>([]);

  const titleMap = routeMap[pathname];

  const title = titleMap[language] || titleMap[defaultLanguage];

  const { component: Component, outlinePromise } = locales[language] || locales[defaultLanguage];

  const isDebugMode = useIsDebugMode();

  const updateOutline = useConstantFn((p: Promise<Outline>) => {
    p.then((data) => {
      if (p === outlinePromise) {
        data = data.length === 1 ? data[0].children : data;
        setOutline(data);
      }
    }).catch((e) => console.error(e));
  });

  React.useEffect(() => {
    updateOutline(outlinePromise);
  }, [updateOutline, outlinePromise]);

  const Instance = Component ? <Component /> : null;

  return (
    <>
      <Head>{title && <title>{title} | xl-vision</title>}</Head>
      <Row removeOnUnvisible={true}>
        <Row.Col column={{ xs: 24, lg: 20, xxl: 21 }}>{Instance}</Row.Col>
        <Row.Col column={{ xs: 0, lg: 4, xxl: 3 }}>
          <Anchor offsetTop={height + 20} targetOffset={height}>
            {genMenus(outline, isDebugMode)}
          </Anchor>
        </Row.Col>
      </Row>
    </>
  );
};

export default Docs;

const genMenus = (outline: Outline, isDebugMode: boolean) => {
  if (!isDebugMode) {
    outline = outline.filter((it) => !it.debug);
  }

  return outline.map((it) => (
    <Anchor.Link key={it.id} href={`#${it.id}`} title={it.title}>
      {genMenus(it.children || [], isDebugMode)}
    </Anchor.Link>
  ));
};
