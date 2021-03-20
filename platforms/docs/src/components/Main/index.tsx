import React from 'react';
import { Route, Switch } from 'react-router-dom';
import routeMap, { Route as RouteType } from '../../routes';
import { LocalizationContext } from '../LocalizationProvider';
import Markdown from '../Markdown';

const traverseRoutes = (routesArray: Array<RouteType>): Array<JSX.Element> => {
  const routeElements: Array<JSX.Element> = [];
  routesArray.forEach((it) => {
    if ('children' in it) {
      const childElements = traverseRoutes(it.children);
      routeElements.push(...childElements);
      return;
    }
    const { path, component, name } = it;

    if (component) {
      const LazyComponent = React.lazy(component);
      const route = (
        <Route exact={true} path={path} render={() => <LazyComponent name={name} />} key={path} />
      );
      routeElements.push(route);
    }
  });

  return routeElements;
};

const Main: React.FunctionComponent<{ className?: string }> = (props) => {
  const { language } = React.useContext(LocalizationContext);

  const nodes = React.useMemo(() => {
    const routes = routeMap[language];
    return traverseRoutes(routes);
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
