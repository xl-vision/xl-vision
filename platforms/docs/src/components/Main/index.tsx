import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import routeMap, { Route as RouteType } from '../../routes';
import { LocalizationContext } from '../LocalizationProvider';
import Markdown from '../Markdown';

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
      const { component } = it;
      const LazyComponent = React.lazy(component);
      const route = (
        <Route
          exact={true}
          path={fullPath}
          render={() => <LazyComponent name={name} />}
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

const Main: React.FunctionComponent<{ className?: string }> = (props) => {
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
    <Markdown {...props}>
      <React.Suspense fallback={<div>loading</div>}>
        <Switch>{nodes}</Switch>
      </React.Suspense>
    </Markdown>
  );
};

export default Main;
