import { styled } from '@xl-vision/react';
import { mix } from '@xl-vision/react/utils/color';
import Link from 'next/link';
import React from 'react';
import { useLocale } from '../LocalizationProvider';

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

const A = styled('a')(({ theme }) => {
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
  routesArray: Array<RouteType>,
  language: string,
  level = 1,
): JSX.Element => {
  const routeElements: Array<JSX.Element> = [];
  routesArray.forEach((it, index) => {
    const { names } = it;
    const name = names[language];
    let el: JSX.Element;
    if ('children' in it) {
      const childElements = traverseRoutes(it.children, language, level + 1);
      el = (
        <>
          <NonLeftNode style={{ paddingLeft: padding * level }}>{name}</NonLeftNode>
          {childElements}
        </>
      );
    } else {
      const { path } = it;

      el = (
        <Link passHref={true} href={path}>
          <A>
            <LeftNode style={{ paddingLeft: padding * level }}>{name}</LeftNode>
          </A>
        </Link>
      );
    }
    routeElements.push(
      // eslint-disable-next-line react/no-array-index-key
      <li key={index}>{el}</li>,
    );
  });

  return <NodeWrapper>{routeElements}</NodeWrapper>;
};

export type BaseRoute = {
  names: Record<string, string>;
};

export type NonLeftRoute = BaseRoute & {
  children: Array<RouteType>;
};

export type LeftRoute = BaseRoute & {
  path: string;
};

export type RouteType = LeftRoute | NonLeftRoute;

const Wrapper = styled('div')(() => {
  return {
    li: {
      marginTop: '8px',
    },
  };
});

export type AsideProps = {
  routes: Array<RouteType>;
};

const Aside: React.FunctionComponent<AsideProps> = (props) => {
  const { routes } = props;

  const { language } = useLocale();

  const nodes = React.useMemo(() => {
    return traverseRoutes(routes, language);
  }, [routes, language]);

  if (!nodes) {
    return null;
  }

  return <Wrapper {...props}>{nodes}</Wrapper>;
};

export default Aside;
