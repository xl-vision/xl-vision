import { createGlobalStyles, CssBaseline } from '@xl-vision/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/Layout';
import LocalizationProvider from './components/LocalizationProvider';
import ThemeProvider from './components/ThemeProvider';

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

const App = () => {
  return (
    <LocalizationProvider>
      <ThemeProvider>
        <CssBaseline />
        <GlobalStyle />
        <Router>
          <Layout />
        </Router>
      </ThemeProvider>
    </LocalizationProvider>
  );
};

export default App;
