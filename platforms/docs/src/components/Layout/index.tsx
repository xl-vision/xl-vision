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
    position: 'fixed',
    top: 60,
    overflowY: 'auto',
    height: '100%',
    width: '260px',
    backgroundColor: theme.color.background,
    '@media(max-width: 768px)': {
      width: '100%',
    },
  };
});

const MainWrapper = styled('div')(() => {
  return {
    marginLeft: '260px',
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
          </MainWrapper>
        </Content>
        <Footer />
      </Router>
    </ThemeProvider>
  );
};

export default Layout;
