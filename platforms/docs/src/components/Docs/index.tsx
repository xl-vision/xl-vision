import { defaultLanguage } from '@xl-vision/react/locale';
import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useConstantFn } from '@xl-vision/hooks';
import { Anchor, Row } from '@xl-vision/react';
import { useLocale } from '../LocalizationProvider';
import routes, { Route, RouteType } from '../../routes';

export type DocsProps = {
  locales: Record<string, { component: React.ComponentType; outlinePromise: Promise<Array<any>> }>;
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

  const [outline, setOutline] = React.useState<Array<any>>([]);

  const titleMap = routeMap[pathname];

  const title = titleMap[language] || titleMap[defaultLanguage];

  const { component: Component, outlinePromise } = locales[language] || locales[defaultLanguage];

  const updateOutline = useConstantFn((p: Promise<Array<any>>) => {
    p.then((data) => {
      if (p === outlinePromise) {
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
      <Row>
        <Row.Col column={18}>{Instance}</Row.Col>
        <Row.Col column={6}>
          <Anchor offsetTop={100}>{genMenus(outline)}</Anchor>
        </Row.Col>
      </Row>
    </>
  );
};

export default Docs;

const genMenus = (outline: Array<any>) => {
  return outline.map((it) => (
    <Anchor.Link key={it.id} href={`#${it.id}`} title={it.title}>
      {genMenus(it.children || [])}
    </Anchor.Link>
  ));
};
