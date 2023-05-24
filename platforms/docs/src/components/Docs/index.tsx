import { Anchor, Row } from '@xl-vision/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ComponentType, FC } from 'react';
import useIsDebugMode from '../../hooks/useIsDebugMode';
import routes, { Route, RouteType } from '../../routes';
import { HEADER_HEIGHT } from '../Header';
import { defaultLanguage, useLocale } from '../LocalizationProvider';

export type DocsProps = {
  locales: Record<string, { component: ComponentType; outline: Outline }>;
};

export type Outline = Array<{
  children: Outline;
  id: string;
  title: string;
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

const Docs: FC<DocsProps> = ({ locales }) => {
  const { language } = useLocale();

  const { pathname } = useRouter();

  const titleMap = routeMap[pathname];

  const title = titleMap[language] || titleMap[defaultLanguage];

  const docsInfo = locales[language] || locales[defaultLanguage];

  const { component: Component, outline } = docsInfo;

  const isDebugMode = useIsDebugMode();

  const Instance = Component ? <Component /> : null;

  const titleContent = `${title} | xl-vision`;

  const outlineNodes = genMenus(outline, isDebugMode);

  return (
    <>
      <Head>{title && <title>{titleContent}</title>}</Head>
      <Row removeOnUnvisible={true}>
        <Row.Col column={{ xs: 24, lg: 20, xxl: 21 }}>{Instance}</Row.Col>
        <Row.Col column={{ xs: 0, lg: 4, xxl: 3 }}>
          {outlineNodes && (
            <Anchor offsetTop={HEADER_HEIGHT + 20} targetOffset={HEADER_HEIGHT}>
              {outlineNodes}
            </Anchor>
          )}
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

  if (!outline || !outline.length) {
    return null;
  }

  return outline.map((it) => (
    <Anchor.Link href={`#${it.id}`} key={it.id} title={it.title}>
      {genMenus(it.children || [], isDebugMode)}
    </Anchor.Link>
  ));
};
