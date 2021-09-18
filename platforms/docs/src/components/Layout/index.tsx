import { styled } from '@xl-vision/react';
import React from 'react';
import { useLocation } from 'react-router-dom';
import Aside from '../Aside';
import Footer from '../Footer';
import Header from '../Header';
import Main from '../Main';

const asideWidth = 280;

const AsideWrapper = styled(Aside)(({ theme }) => {
  return {
    padding: '0 12px',
    '@media(max-width: 768px)': {
      borderBottom: `1px solid ${theme.color.divider}`,
    },
    '@media(min-width: 768px)': {
      position: 'fixed',
      top: 60,
      bottom: 0,
      overflowY: 'hidden',
      width: asideWidth,
      borderRight: `1px solid ${theme.color.divider}`,
      ':hover': {
        overflowY: 'auto',
      },
    },
  };
});

const MainWrapper = styled('div')<{ isIndex: boolean }>(({ styleProps }) => {
  const { isIndex } = styleProps;
  return {
    padding: '0 16px',
    '@media(min-width: 768px)': {
      position: 'fixed',
      top: 60,
      bottom: 0,
      left: isIndex ? 0 : asideWidth,
      right: 0,
      overflowY: 'auto',
      main: {
        minHeight: '100%',
      },
    },
  };
});

const Layout = () => {
  const { pathname } = useLocation();

  const isIndex = pathname === '/';

  return (
    <>
      <Header />
      {!isIndex && <AsideWrapper />}
      <MainWrapper styleProps={{ isIndex }}>
        <Main />
        <Footer />
      </MainWrapper>
    </>
  );
};

export default Layout;
