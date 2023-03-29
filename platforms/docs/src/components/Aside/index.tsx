import { styled } from '@xl-vision/react';
import clsx from 'clsx';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { FC, Children, cloneElement, HTMLAttributes, forwardRef, useMemo } from 'react';
import route, { BaseRoute, Route, RouteType } from '../../routes';
import { defaultLanguage, useLocale } from '../LocalizationProvider';

const LeftNode = styled('span')(() => {
  return {
    width: '100%',
    display: 'inline-block',
    padding: '8px 40px',
    fontSize: '14px',
    boxSizing: 'border-box',
  };
});

const NonLeftNode = styled(LeftNode)(({ theme }) => {
  return {
    // color: `${theme.color.text.primary}`,
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

const ActiveLink: FC<LinkProps> = (props) => {
  const { children, href, ...others } = props;
  const { pathname } = useRouter();

  const child: any = Children.only(children);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  const classes = clsx(child.className, {
    active: (href as string).replace(/\/$/, '') === pathname,
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const newChild = cloneElement(child, {
    className: classes,
  });

  return (
    <Link {...others} href={href}>
      {newChild}
    </Link>
  );
};

const A = styled('a')(({ theme }) => {
  const { themes, text } = theme.colors;
  return {
    display: 'inline-block',
    width: '100%',
    position: 'relative',
    color: `${text.primary}`,
    '&:hover': {
      // color: `${mix(
      //   theme.color.themes.primary.text.primary,
      //   themes.primary.color,
      //   themes.primary.action.hover,
      // )}`,
    },
    '&.active': {
      // backgroundColor: `${themes.primary.hover}`,
      // color: `${theme.color.themes.primary.text.primary}`,
    },
  };
});

const padding = 12;

const traverseRoutes = (
  routeName: string,
  routesArray: Array<RouteType>,
  language: string,
  appendEn: boolean,
  level = 1,
): JSX.Element => {
  const routeElements: Array<JSX.Element> = [];
  routesArray.forEach((it, index) => {
    const { titleMap } = it;

    const lang = language || defaultLanguage;

    let title = titleMap[lang as keyof BaseRoute['titleMap']];
    let el: JSX.Element;

    if ('children' in it) {
      const childElements = traverseRoutes(routeName, it.children, language, appendEn, level + 1);
      el = (
        <>
          <NonLeftNode style={{ paddingLeft: padding * level }}>{title}</NonLeftNode>
          {childElements}
        </>
      );
    } else {
      const { path } = it;

      const fullPath = `/${routeName}${path}`;

      const enUsName = titleMap['en-US'];
      title = lang === 'en-US' ? enUsName : appendEn ? `${title} ${enUsName}` : title;

      el = (
        <ActiveLink href={fullPath} passHref={true}>
          <A>
            <LeftNode style={{ paddingLeft: padding * level }}>{title}</LeftNode>
          </A>
        </ActiveLink>
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

export type AsideProps = HTMLAttributes<HTMLDivElement> & {
  routeName: keyof Route;
  appendEn?: boolean;
};

const Aside: FC<AsideProps> = forwardRef<HTMLDivElement, AsideProps>((props, ref) => {
  const { language } = useLocale();

  const { routeName, appendEn = true, ...others } = props;

  const nodes = useMemo(() => {
    return traverseRoutes(routeName, route[routeName], language, appendEn);
  }, [routeName, language, appendEn]);

  if (!nodes) {
    return null;
  }

  return (
    <Wrapper {...others} ref={ref}>
      {nodes}
    </Wrapper>
  );
});

export default Aside;
