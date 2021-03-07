import React from 'react';
import { Route, Switch } from 'react-router-dom';
import routes, { Route as RouteType } from '../../routes';
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

const routeElements = traverseRoutes(routes);

const Main: React.FunctionComponent<{ className?: string }> = (props) => {
  return (
    <Markdown {...props}>
      <React.Suspense fallback={<div>loading</div>}>
        <Switch>{routeElements}</Switch>
      </React.Suspense>
    </Markdown>
  );
};

export default Main;
