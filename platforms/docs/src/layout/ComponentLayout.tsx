import { styled } from '@xl-vision/react';
import React from 'react';
import ComponentAside from '../components/ComponentAside';
import Header from '../components/Header';
import { Layout } from './Layout';

const Root = styled('div')(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
  };
});

const ComponentLayout: Layout = ({ children }) => {
  return (
    <Root>
      <Header />
      <div className='main'>
        <ComponentAside />
        {children}
      </div>
    </Root>
  );
};

export default ComponentLayout;
