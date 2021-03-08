import { createGlobalStyles, styled, CssBaseline } from '@xl-vision/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Aside from '../Aside';
import Footer from '../Footer';
import Header from '../Header';
import Main from '../Main';
import ThemeProvider from '../ThemeProvider';

const GlobalStyle = createGlobalStyles(() => {
  return {
    'html,body': {
      width: '100%',
      height: '100%',
    },

    '#app': {
      height: '100%',
    },
  };
});

const Content = styled('div')(() => {
  return {
    // display: 'flex',
    // height: '100%',
    // flexWrap: 'wrap',
    // '> main': {
    //   flex: 1,
    //   overflowX: 'auto',
    //   margin: '0 16px',
    // },
  };
});

const AsideWrapper = styled(Aside)(({ theme }) => {
  return {
    backgroundColor: theme.color.background,

    '@media(min-width: 768px)': {
      position: 'fixed',
      top: 60,
      bottom: 0,
      overflowY: 'auto',
      width: '260px',
      borderRight: `1px solid ${theme.color.divider}`,
    },
    '@media(max-width: 768px)': {
      width: '100%',
      borderBottom: `1px solid ${theme.color.divider}`,
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
      left: 260 - 12,
      right: 0,
      overflowY: 'auto',
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
        <Content>
          <AsideWrapper />
          <MainWrapper>
            <Main />
            <Footer />
          </MainWrapper>
        </Content>
      </Router>
    </ThemeProvider>
  );
};

export default Layout;
