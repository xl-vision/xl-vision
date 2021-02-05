import { styled } from '@xl-vision/react';
import React from 'react';
import { NavLink } from 'react-router-dom';
import routes, { Route as RouteType } from '../../routes';

const LeftNode = styled('span')`
  width: 100%;
  display: inline-block;
  padding: 12px 40px;
  font-size: 14px;
  box-sizing: border-box;
`;

const NonLeftNode = styled(LeftNode)`
  border-bottom: 1px solid #eee;
  margin: 0;
  color: rgba(0, 0, 0, 0.45);
`;

const NodeWrapper = styled('ul')`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NavLinkWrapper = styled(NavLink)`
  display: inline-block;
  width: 100%;
  position: relative;
  color: rgba(0, 0, 0, 0.85);
  &.active {
    background-color: #e6f7ff;
    color: #1890ff;

    &::after {
      content: ' ';
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      width: 2px;
      background-color: #1890ff;
    }
  }
`;

const traverseRoutes = (routesArray: Array<RouteType>): JSX.Element => {
  const routeElements: Array<JSX.Element> = [];
  routesArray.forEach((it, index) => {
    const { name } = it;
    let el: JSX.Element;
    if ('children' in it) {
      const childElements = traverseRoutes(it.children);
      el = (
        <>
          <NonLeftNode>{name}</NonLeftNode>
          {childElements}
        </>
      );
    } else {
      const { path } = it;
      el = (
        <NavLinkWrapper exact={true} to={path} replace={true}>
          <LeftNode>{name}</LeftNode>
        </NavLinkWrapper>
      );
    }
    routeElements.push(
      // eslint-disable-next-line react/no-array-index-key
      <li key={index}>{el}</li>,
    );
  });

  return <NodeWrapper>{routeElements}</NodeWrapper>;
};

const el = traverseRoutes(routes);

const Wrapper = styled('div')`
  width: 260px;
  /* height: 100%; */
  border-right: 1px solid #eee;

  li {
    margin-top: 8px;
  }
`;

const Aside = () => {
  return <Wrapper>{el}</Wrapper>;
};

export default Aside;
