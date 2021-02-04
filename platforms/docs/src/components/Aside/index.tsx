import React from 'react';
import { Link } from 'react-router-dom';
import routes, { Route as RouteType } from '../../routes';

const traverseRoutes = (routes: Array<RouteType>): JSX.Element => {
  const routeElements: Array<JSX.Element> = [];
  routes.forEach((it, index) => {
    const { name } = it;
    let el: JSX.Element;
    if ('children' in it) {
      const childElements = traverseRoutes(it.children);
      el = (
        <>
          <span>{name}</span>
          {childElements}
        </>
      );
    } else {
      const { path } = it;
      el = (
        <Link to={path}>
          <span>{name}</span>
        </Link>
      );
    }
    routeElements.push(
      // eslint-disable-next-line react/no-array-index-key
      <li key={index}>{el}</li>,
    );
  });

  return <ul>{routeElements}</ul>;
};

const el = traverseRoutes(routes);

const Aside = () => {
  return <div>{el}</div>;
};

export default Aside;
