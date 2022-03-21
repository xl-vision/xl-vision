import { styled } from '@xl-vision/react';
import React from 'react';
import Header, { height } from '../components/Header';
import { Layout } from './Layout';

const Root = styled('div')(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    '.main': {
      flex: 1,
      paddingTop: height,
    },
  };
});

const HeaderLayout: Layout = ({ children }) => {
  return (
    <Root>
      <Header />
      <div className='main'>{children}</div>
    </Root>
  );
};

export default HeaderLayout;
