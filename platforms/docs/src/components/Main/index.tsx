import React from 'react';
import { Route, Switch } from 'react-router-dom';
import routes, { Route as RouteType } from '../../routes';
import Markdown from '../Markdown';

const traverseRoutes = (routes: Array<RouteType>): Array<JSX.Element> => {
  const routeElements: Array<JSX.Element> = [];
  routes.forEach((it) => {
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

const Main = () => {
  return (
    <Markdown>
      <React.Suspense fallback={<div>loading</div>}>
        <Switch>{routeElements}</Switch>
      </React.Suspense>
    </Markdown>
  );
};

export default Main;
