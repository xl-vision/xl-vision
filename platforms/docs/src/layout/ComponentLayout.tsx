import { styled } from '@xl-vision/react';
import React from 'react';
import Aside, { RouteType } from '../components/Aside';
import Header from '../components/Header';
import { Layout } from './Layout';

const Root = styled('div')(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
  };
});

const routes: Array<RouteType> = [
  {
    names: {
      'en-US': 'Overview',
      'zh-CN': '总览',
    },
    path: '/components',
  },
];

const ComponentLayout: Layout = ({ children }) => {
  return (
    <Root>
      <Header />
      <div className='main'>
        <Aside routes={routes} />
        {children}
      </div>
    </Root>
  );
};

export default ComponentLayout;
