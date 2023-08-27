'use client';

import { styled, Row, Affix, BackTop } from '@xl-vision/react';
import { notFound, useParams } from 'next/navigation';
import { FC, useMemo, useState, useEffect } from 'react';
import { RouteType } from '../../routes';
import Aside from '../Aside';
import Docs, { LocaleComponentMap } from '../Docs';
import Footer from '../Footer';
import Header, { HEADER_HEIGHT } from '../Header';
import Markdown from '../Markdown';

export type BaseLayoutProps = {
  routes: Array<RouteType>;
  appendEn?: boolean;
  basePath: string;
};

const Root = styled('div')(({ theme }) => {
  return {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.colors.background.paper,
    // '.menu-button': {
    //   position: 'fixed',
    //   zIndex: 1000,
    //   right: 0,
    //   top: height + 10,
    //   borderTopRightRadius: 0,
    //   borderBottomRightRadius: 0,
    // },
    // '.mobile-menus': {
    //   position: 'fixed',
    //   top: height,
    //   width: '100%',
    //   height: '100%',
    //   overflowY: 'auto',
    //   zIndex: 10,
    // },
    // '.aside': {
    //   '&-enter-active, &-exit-active': {
    //     transition: 'height 0.4s ease',
    //   },
    // },
  };
});

const AsideWrapper = styled(Aside)(({ theme }) => {
  // const { breakpoints } = theme;

  // const { values, unit } = breakpoints;

  return {
    // width: '100%',
    backgroundColor: theme.colors.background.paper,
    height: '100%',
    maxHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
    overflowY: 'hidden',
    ':hover': {
      overflowY: 'auto',
    },

    // [`@media(min-width: ${values.md}${unit})`]: {
    //   position: 'fixed',
    //   top: height,
    //   bottom: 0,
    //   width: asideWidth,
    //   borderRight: `${theme.styleSize.middle.border}px solid ${theme.color.divider}`,
    //   overflowY: 'hidden',
    //   ':hover': {
    //     overflowY: 'auto',
    //   },
    // },
  };
});

const MainWrapper = styled('div')(({ theme }) => {
  // const { breakpoints } = theme;

  // const { values, unit } = breakpoints;

  // const mobileWidth = `${values.md}${unit}`;

  return {
    // padding: '0 16px',
    // marginTop: height,
    backgroundColor: theme.colors.background.paper,
    overflowY: 'auto',
    // [`@media(min-width: ${mobileWidth})`]: {
    //   marginTop: 0,
    //   position: 'fixed',
    //   top: height,
    //   bottom: 0,
    //   left: asideWidth,
    //   right: 0,
    // },
  };
});

const flatRoutes = (
  routes: Array<RouteType>,
  record: Record<string, () => Promise<typeof import('*.mdx?locale')>> = {},
): Record<string, () => Promise<typeof import('*.mdx?locale')>> => {
  routes.forEach((it) => {
    if ('children' in it) {
      flatRoutes(it.children, record);
      return;
    }
    record[it.name] = it.docs;
  });

  return record;
};

const DocsRouteRender: FC<BaseLayoutProps> = ({ basePath, routes, appendEn }) => {
  const { name } = useParams();

  const flattedRoutes = useMemo(() => {
    return flatRoutes(routes);
  }, [routes]);

  const lazyDocs = useMemo(() => {
    let key: string | undefined;
    if (!name) {
      key = '';
    } else if (Array.isArray(name) && name.length === 1) {
      key = name[0];
    }

    if (key !== undefined) {
      return flattedRoutes[key];
    }
  }, [flattedRoutes, name]);

  const [docs, setDocs] = useState<LocaleComponentMap>();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    lazyDocs?.().then((it) => setDocs(it.default));
  }, [lazyDocs]);

  if (!lazyDocs) {
    return notFound();
  }

  return (
    <Root>
      <Header />
      {/* <Button className='menu-button md-down' onClick={handleAsideVisible} color='primary'>
        {locale.layout.component.mobileAsideButton}
      </Button>
      <div
        className='mobile-menus md-down'
        style={{
          pointerEvents: asideVisible ? undefined : 'none',
          backgroundColor: asideVisible ? theme.color.background.paper : 'transparent',
        }}
      >
        <CollapseTransition in={asideVisible} transitionClasses='aside'>
          <AsideWrapper routeName='components' />
        </CollapseTransition>
      </div> */}
      <BackTop />
      <Row removeOnUnvisible={true}>
        <Row.Col column={{ xs: 0, md: 6, xl: 5, xxl: 4 }}>
          <Affix offsetTop={HEADER_HEIGHT}>
            <div>
              <AsideWrapper appendEn={appendEn} basePath={basePath} routes={routes} />
            </div>
          </Affix>
        </Row.Col>
        <Row.Col column={{ xs: 24, md: 18, xl: 19, xxl: 20 }}>
          <MainWrapper>
            {docs && <Docs map={docs} />}
            <Footer />
          </MainWrapper>
        </Row.Col>
      </Row>
    </Root>
  );
};

export default DocsRouteRender;
