import React from 'react';
import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Aside from '../Aside';
import Footer from '../Footer';
import Header from '../Header';
import Main from '../Main';

const Layout = () => {
  return (
    <Router>
      <div>
        <Header />
        <div>
          <Aside />
          <Main />
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default Layout;
