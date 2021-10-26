import { styled } from '@xl-vision/react';
import React from 'react';
import Header from '../components/Header';
import { Layout } from './Layout';

const Root = styled('div')(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
  };
});

const DefaultLayout: Layout = ({ children }) => {
  return (
    <Root>
      <Header />
      <div className='main'>{children}</div>
    </Root>
  );
};

export default DefaultLayout;
