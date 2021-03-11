import { createGlobalStyles, styled, CssBaseline } from '@xl-vision/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Aside from '../Aside';
import Footer from '../Footer';
import Header from '../Header';
import Main from '../Main';
import ThemeProvider from '../ThemeProvider';

const GlobalStyle = createGlobalStyles(({ theme }) => {
  const { color } = theme;
  return {
    'html,body': {
      width: '100%',
      height: '100%',
    },
    '#app': {
      height: '100%',
    },
    '::-webkit-scrollbar': {
      width: 8,
      height: 8,
      // backgroundColor: color.grey[500],
    },
    // '::-webkit-scrollbar-track': {
    //   boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
    // },
    '::-webkit-scrollbar-thumb': {
      backgroundColor: color.grey.A100,
      borderRadius: 5,
    },
  };
});

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

const MainWrapper = styled('div')(() => {
  return {
    padding: '0 16px',
    '@media(min-width: 768px)': {
      position: 'fixed',
      top: 60,
      bottom: 0,
      left: asideWidth,
      right: 0,
      overflowY: 'auto',
      main: {
        minHeight: '100%',
      },
    },
  };
});

const Layout = () => {
  return (
    <ThemeProvider>
      <CssBaseline />
      <GlobalStyle />
      <Router>
        <Header />
        <AsideWrapper />
        <MainWrapper>
          <Main />
          <Footer />
        </MainWrapper>
      </Router>
    </ThemeProvider>
  );
};

export default Layout;
