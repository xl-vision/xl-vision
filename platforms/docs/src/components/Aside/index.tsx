import { styled } from '@xl-vision/react';
import { defaultLanguage } from '@xl-vision/react/locale';
import { mix } from '@xl-vision/react/utils/color';
import Link from 'next/link';
import React from 'react';
import route, { Route, RouteType } from '../../routes';
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
  routeName: string,
  routesArray: Array<RouteType>,
  language: string,
  level = 1,
): JSX.Element => {
  const routeElements: Array<JSX.Element> = [];
  routesArray.forEach((it, index) => {
    const { titleMap } = it;
    const title = titleMap[language] || titleMap[defaultLanguage];
    let el: JSX.Element;
    if ('children' in it) {
      const childElements = traverseRoutes(routeName, it.children, language, level + 1);
      el = (
        <>
          <NonLeftNode style={{ paddingLeft: padding * level }}>{title}</NonLeftNode>
          {childElements}
        </>
      );
    } else {
      const { path } = it;

      const fullPath = `/${routeName}${path}`;

      el = (
        <Link passHref={true} href={fullPath}>
          <A>
            <LeftNode style={{ paddingLeft: padding * level }}>{title}</LeftNode>
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

const Wrapper = styled('div')(() => {
  return {
    li: {
      marginTop: '8px',
    },
  };
});

export type AsideProps = {
  routeName: keyof Route;
};

const Aside: React.FunctionComponent<AsideProps> = (props) => {
  const { language } = useLocale();

  const { routeName, ...others } = props;

  const nodes = React.useMemo(() => {
    return traverseRoutes(routeName, route[routeName], language);
  }, [routeName, language]);

  if (!nodes) {
    return null;
  }

  return <Wrapper {...others}>{nodes}</Wrapper>;
};

export default Aside;
