import { LocalizationContext, styled } from '@xl-vision/react';
import { mix } from '@xl-vision/react/utils/color';
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import routeMap, { Route as RouteType } from '../../routes';

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
    margin: 0,
    padding: 0,
  };
});

const NavLinkWrapper = styled(NavLink)(({ theme }) => {
  const { themes, text } = theme.color;
  return {
    display: 'inline-block',
    width: '100%',
    position: 'relative',
    color: `${text.primary}`,
    '&:hover': {
      color: `${mix(
        theme.color.themes.primary.text.primary,
        themes.primary.color,
        themes.primary.action.hover,
      )}`,
    },
    '&.active': {
      backgroundColor: `${themes.primary.color}`,
      color: `${theme.color.themes.primary.text.primary}`,
    },
  };
});

const padding = 12;

const traverseRoutes = (
  basePath: string,
  routesArray: Array<RouteType>,
  level = 1,
): JSX.Element => {
  const routeElements: Array<JSX.Element> = [];
  routesArray.forEach((it, index) => {
    const { name } = it;
    let el: JSX.Element;
    if ('children' in it) {
      const childElements = traverseRoutes(basePath, it.children, level + 1);
      el = (
        <>
          <NonLeftNode style={{ paddingLeft: padding * level }}>{name}</NonLeftNode>
          {childElements}
        </>
      );
    } else {
      const { path } = it;
      el = (
        <NavLinkWrapper exact={true} to={`/${basePath}${path}`}>
          <LeftNode style={{ paddingLeft: padding * level }}>{name}</LeftNode>
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

const Wrapper = styled('div')(() => {
  return {
    li: {
      marginTop: '8px',
    },
  };
});

const Aside: React.FunctionComponent<{ className?: string }> = (props) => {
  const { language } = React.useContext(LocalizationContext);

  const { pathname } = useLocation();

  const key = React.useMemo(() => {
    return Object.keys(routeMap).find((it) => pathname.startsWith(`/${it}`));
  }, [pathname]);

  const nodes = React.useMemo(() => {
    if (!key) {
      return null;
    }
    const routes = routeMap[key as keyof typeof routeMap][language];
    return traverseRoutes(key, routes);
  }, [key, language]);

  if (!nodes) {
    return null;
  }

  return <Wrapper {...props}>{nodes}</Wrapper>;
};

export default Aside;
