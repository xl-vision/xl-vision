import { styled } from '@xl-vision/react';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FC,
  Children,
  cloneElement,
  HTMLAttributes,
  forwardRef,
  useMemo,
  JSX,
  ReactElement,
} from 'react';
import useLocale from '@docs/hooks/useLocale';
import { Lang, defaultLang } from '@docs/locales';
import { join } from '@docs/utils/link';
import { OmitRouteType } from '../../routes';

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
    color: `${theme.colors.text.primary}`,
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

const StyledLink = styled(Link)(({ theme }) => {
  const { themes, text } = theme.colors;
  return {
    display: 'inline-block',
    width: '100%',
    position: 'relative',
    color: text.primary,
    '&:hover': {
      color: themes.primary.foreground.hover,
    },
    '& > .active': {
      backgroundColor: themes.primary.foreground.default,
      color: theme.colors.themes.primary.text.primary,
    },
  };
});

const ActiveLink: typeof StyledLink = (props) => {
  const { children, href, ...others } = props;
  const pathname = usePathname();

  const child = Children.only(children);

  const classes = clsx((child as { className?: string }).className, {
    active: (href as string).replace(/\/$/, '') === pathname,
  });

  const newChild = cloneElement(child as ReactElement<{ className?: string }>, {
    className: classes,
  });

  return (
    <StyledLink {...others} href={href}>
      {newChild}
    </StyledLink>
  );
};

const padding = 12;

const traverseRoutes = (
  basePath: string,
  routesArray: Array<OmitRouteType>,
  lang: Lang,
  appendEn: boolean,
  level = 1,
): JSX.Element => {
  const routeElements: Array<JSX.Element> = [];
  routesArray.forEach((it, index) => {
    const { titleMap } = it;

    lang = lang || defaultLang;

    let title = titleMap[lang];
    let el: JSX.Element;

    if ('children' in it) {
      const childElements = traverseRoutes(basePath, it.children, lang, appendEn, level + 1);
      el = (
        <>
          <NonLeftNode style={{ paddingLeft: padding * level }}>{title}</NonLeftNode>
          {childElements}
        </>
      );
    } else {
      const { name } = it;

      const fullPath = join(`/${lang}`, basePath, name);

      const enUsName = titleMap['en-US'];
      title = lang === 'en-US' ? enUsName : appendEn ? `${title} ${enUsName}` : title;

      el = (
        <ActiveLink href={fullPath} passHref={true}>
          <LeftNode style={{ paddingLeft: padding * level }}>{title}</LeftNode>
        </ActiveLink>
      );
    }
    routeElements.push(<li key={index}>{el}</li>);
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
  routes: Array<OmitRouteType>;
  appendEn?: boolean;
  basePath: string;
};

const Aside: FC<AsideProps> = forwardRef<HTMLDivElement, AsideProps>((props, ref) => {
  const { lang } = useLocale();

  const { routes, appendEn = true, basePath, ...others } = props;

  const nodes = useMemo(() => {
    return traverseRoutes(basePath, routes, lang, appendEn);
  }, [basePath, lang, appendEn, routes]);

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
