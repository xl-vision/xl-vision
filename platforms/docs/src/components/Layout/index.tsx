import { styled } from '@xl-vision/react';
import { createGlobalStyles } from '@xl-vision/styled-engine';
import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import Aside from '../Aside';
import Footer from '../Footer';
import Header from '../Header';
import Main from '../Main';

const GlobalStyle = createGlobalStyles`
  html,body {
    margin: 0;
    width: 100%;
    min-height: 100%;
  }

  #app {
    min-height: 100%;
  }
`;

const Content = styled('div')`
  display: flex;
  height: 100%;

  > main {
    margin-left: 16px;
    margin-top: 16px;
    flex: 1;
  }
`;

const Layout = () => {
  return (
    <Router>
      <GlobalStyle />
      <Header />
      <Content>
        <Aside />
        <Main />
      </Content>
      <Footer />
    </Router>
  );
};

export default Layout;
