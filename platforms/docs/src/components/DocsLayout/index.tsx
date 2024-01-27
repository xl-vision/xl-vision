'use client';

import { styled, Row, Affix, BackTop } from '@xl-vision/react';
import { FC, ReactNode } from 'react';
import { OmitRouteType } from '@docs/routes';
import Aside from '../Aside';
import Footer from '../Footer';
import Header, { HEADER_HEIGHT } from '../Header';

export type DocsLayoutProps = {
  routes: Array<OmitRouteType>;
  appendEn?: boolean;
  basePath: string;
  children: ReactNode;
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
    '&:hover': {
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
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
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

const Content = styled('div')(() => {
  return {
    flex: 1,
  };
});

const DocsLayout: FC<DocsLayoutProps> = ({ basePath, routes, appendEn, children }) => {
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
            <AsideWrapper appendEn={appendEn} basePath={basePath} routes={routes} />
          </Affix>
        </Row.Col>
        <Row.Col column={{ xs: 24, md: 18, xl: 19, xxl: 20 }}>
          <MainWrapper>
            <Content>{children}</Content>
            <Footer />
          </MainWrapper>
        </Row.Col>
      </Row>
    </Root>
  );
};

export default DocsLayout;
