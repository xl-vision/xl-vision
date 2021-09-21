import { createGlobalStyles, CssBaseline, LocalizationContext } from '@xl-vision/react';
import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import LocalizationProvider from './components/LocalizationProvider';
import ThemeProvider from './components/ThemeProvider';
import routeMap, { Route as RouteType } from './routes';
import layouts from './layout';
import Markdown from './components/Markdown';
import Loading from './components/Loading';

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
            <Router>
              <AppInner />
            </Router>
          </ThemeProvider>
        </LocalizationProvider>
      </HelmetProvider>
    </React.StrictMode>
  );
};

export default App;

const traverseRoutes = (basePath: string, routesArray: Array<RouteType>): Array<JSX.Element> => {
  const routeElements: Array<JSX.Element> = [];
  routesArray.forEach((it) => {
    if ('children' in it) {
      const childElements = traverseRoutes(basePath, it.children);
      routeElements.push(...childElements);
      return;
    }

    const { path, name } = it;

    if (basePath === 'index') {
      basePath = '';
    }

    const fullPath = `/${basePath}${path}`;

    if ('component' in it) {
      const { component, layout = 'default' } = it;
      const LayoutComponent = layouts[layout];
      const LazyComponent = React.lazy(component);
      const route = (
        <Route
          exact={true}
          path={fullPath}
          render={() => (
            <LayoutComponent>
              <Helmet>
                <title>{name} | xl vision</title>
              </Helmet>
              <LazyComponent />
            </LayoutComponent>
          )}
          key={fullPath}
        />
      );

      routeElements.push(route);
      return;
    }
    const { redirect } = it;

    const fullRedirect = `/${basePath}${redirect}`;

    const route = (
      <Route exact={true} path={fullPath} key={fullPath}>
        <Redirect to={fullRedirect} />
      </Route>
    );
    routeElements.push(route);
  });

  return routeElements;
};

const AppInner = () => {
  const { language } = React.useContext(LocalizationContext);

  const nodes = React.useMemo(() => {
    const computedNodes = Object.keys(routeMap)
      .map((basePath) => {
        const map = routeMap[basePath];
        return traverseRoutes(basePath, map[language]);
      })
      .reduce((arr1, arr2) => arr1.concat(arr2));

    return computedNodes;
  }, [language]);

  return (
    <Markdown>
      <React.Suspense fallback={<Loading />}>
        <Switch>{nodes}</Switch>
      </React.Suspense>
    </Markdown>
  );
};
