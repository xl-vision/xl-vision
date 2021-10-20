import { createGlobalStyles, CssBaseline, LocalizationContext } from '@xl-vision/react';
import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import LocalizationProvider from '../components/LocalizationProvider';
import ThemeProvider from '../components/ThemeProvider';
import routeMap, { Route as RouteType } from './routes';
import layouts from '../layout';
import Markdown from '../components/Markdown';
import Loading from '../components/Loading';

const GlobalStyle = createGlobalStyles(({ theme }) => {
  const { color } = theme;
  return {
    'html,body': {
      width: '100%',
      height: '100%',
    },
    '#app': {
      height: '100%',
    },
    '::-webkit-scrollbar': {
      width: 8,
      height: 8,
      // backgroundColor: color.grey[500],
    },
    // '::-webkit-scrollbar-track': {
    //   boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
    // },
    '::-webkit-scrollbar-thumb': {
      backgroundColor: color.grey.A100,
      borderRadius: 5,
    },
  };
});

const baiduAnalysis = [
  'var _hmt = _hmt || [];',
  '(function () {',
  '   var hm = document.createElement("script");',
  '   hm.src = "https://hm.baidu.com/hm.js?f8befb1d0df5c99624a66291ce9cf662";',
  '   var s = document.getElementsByTagName("script")[0];',
  '   s.parentNode.insertBefore(hm, s);',
  '})()',
].join('\n');

const App = () => {
  return (
    <React.StrictMode>
      <HelmetProvider>
        <Helmet>
          <meta name='description' content='xl-vision,react,library,component,组件,组件库,hooks' />
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
          />
          <link rel='icon' type='image/svg+xml' href='/public/favicon.svg' />
          <link rel='icon' type='image/png' href='/public/favicon.png' />
          <script>{baiduAnalysis}</script>
        </Helmet>
        <LocalizationProvider>
          <ThemeProvider>
            <CssBaseline />
            <GlobalStyle />
            <Markdown>
              <Router>
                <AppInner />
              </Router>
            </Markdown>
          </ThemeProvider>
        </LocalizationProvider>
      </HelmetProvider>
    </React.StrictMode>
  );
};

export default App;

type RouteInfoMap = Record<
  string,
  {
    layout?: React.ComponentType<any>;
    route: React.ReactElement;
  }
>;

const traverseRoutes = (basePath: string, routesArray: Array<RouteType>, map: RouteInfoMap) => {
  routesArray.forEach((it) => {
    if ('children' in it) {
      traverseRoutes(basePath, it.children, map);
      return;
    }

    const { path, name } = it;

    const fullPath =
      basePath === 'index' ? path : path === '/' ? `/${basePath}` : `/${basePath}${path}`;

    if ('component' in it) {
      const { component, layout = 'default' } = it;
      const LayoutComponent = layouts[layout];
      const LazyComponent = React.lazy(component);
      const route = (
        <Route
          exact={true}
          path={fullPath}
          key={fullPath}
          render={() => (
            <>
              <Helmet>
                <title>{name} | xl vision</title>
              </Helmet>
              <LazyComponent />
            </>
          )}
        />
      );

      map[fullPath] = {
        route,
        layout: LayoutComponent,
      };
      return;
    }
    const { redirect } = it;

    const fullRedirect = `/${basePath}${redirect}`;

    const route = (
      <Route exact={true} path={fullPath} key={fullPath}>
        <Redirect to={fullRedirect} />
      </Route>
    );
    map[fullPath] = {
      route,
    };
  });
};

const AppInner = () => {
  const { language } = React.useContext(LocalizationContext);

  const { pathname } = useLocation();

  const routeInfoMap = React.useMemo(() => {
    const allMap: RouteInfoMap = {};
    Object.keys(routeMap).forEach((basePath) => {
      const map = routeMap[basePath];
      return traverseRoutes(basePath, map[language], allMap);
    });

    return allMap;
  }, [language]);

  const routes = React.useMemo(() => {
    return Object.keys(routeInfoMap).map((key) => routeInfoMap[key].route);
  }, [routeInfoMap]);

  const Layout = React.useMemo(() => {
    return routeInfoMap[pathname]?.layout || routeInfoMap[`${pathname}/`]?.layout || React.Fragment;
  }, [routeInfoMap, pathname]);

  return (
    <React.Suspense fallback={<Loading />}>
      <Layout>
        <Switch>{routes}</Switch>
      </Layout>
    </React.Suspense>
  );
};
