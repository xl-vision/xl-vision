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
      minHeight: '100%',
    },

    '#app': {
      minHeight: '100%',
    },
  };
});

const Content = styled('div')(() => {
  return {
    display: 'flex',
    height: '100%',
    flexWrap: 'wrap',
    '> main': {
      flex: 1,
      overflowX: 'auto',
      margin: '0 16px',
    },
  };
});

const Layout = () => {
  return (
    <ThemeProvider>
      <Router>
        <CssBaseline />
        <GlobalStyle />
        <Header />
        <Content>
          <Aside />
          <Main />
        </Content>
        <Footer />
      </Router>
    </ThemeProvider>
  );
};

export default Layout;
