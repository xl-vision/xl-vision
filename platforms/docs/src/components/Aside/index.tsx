import { styled } from '@xl-vision/react';
import { mix } from '@xl-vision/react/utils/color';
import React from 'react';
import { NavLink } from 'react-router-dom';
import routes, { Route as RouteType } from '../../routes';

const LeftNode = styled('span')(() => {
  return {
    width: '100%',
    display: 'inline-block',
    padding: '12px 40px',
    fontSize: '14px',
    boxSizing: 'border-box',
  };
});

const NonLeftNode = styled(LeftNode)(({ theme }) => {
  return {
    color: `${theme.color.text.primary}`,
    fontWeight: `${theme.typography.fontWeight.bold}`,
  };
});

const NodeWrapper = styled('ul')(() => {
  return {
    listStyle: 'none',
    margin: '0 0 0 12px',
    padding: 0,
  };
});

const NavLinkWrapper = styled(NavLink)(({ theme }) => {
  const { themes, background, text } = theme.color;
  return {
    display: 'inline-block',
    width: '100%',
    position: 'relative',
    color: `${text.primary}`,
    '&:hover': {
      color: `${mix(background, themes.primary.color, themes.primary.action.hover)}`,
    },
    '&.active': {
      backgroundColor: `${themes.primary.color}`,
      color: `${theme.color.themes.primary.text.primary}`,
    },
  };
});

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

const Wrapper = styled('div')(({ theme }) => {
  return {
    borderRight: `1px solid ${theme.color.divider}`,
    width: '260px',
    marginLeft: '-12px',
    '@media(max-width: 768px)': {
      width: '100%',
    },

    li: {
      marginTop: '8px',
    },
  };
});

const Aside = () => {
  return <Wrapper>{el}</Wrapper>;
};

export default Aside;
