import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import routes, { Route as RouteType } from '../../routes';

const traverseRoutes = (routes: Array<RouteType>): Array<JSX.Element> => {
  const routeElements: Array<JSX.Element> = [];
  routes.forEach((it) => {
    if ('children' in it) {
      const childElements = traverseRoutes(it.children);
      routeElements.push(...childElements);
      return;
    }
    const { path, component } = it;

    let route: JSX.Element;
    if (!component) {
      route = <Redirect to={path} key={path} />;
    } else {
      const lazyComponent = React.lazy(component);
      route = <Route path={path} component={lazyComponent} key={path} />;
    }
    routeElements.push(route);
  });

  return routeElements;
};

const routeElements = traverseRoutes(routes);

const Main = () => {
  return (
    <main>
      <React.Suspense fallback={<div>loading</div>}>
        <Switch>{routeElements}</Switch>
      </React.Suspense>
    </main>
  );
};

export default Main;
