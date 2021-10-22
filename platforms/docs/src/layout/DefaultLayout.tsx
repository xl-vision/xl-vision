import { styled } from '@xl-vision/react';
import React from 'react';
import Header from '../components/Header';

export type DefaultLayoutProps = {
  children: React.ReactNode;
};

const Root = styled('div')(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
  };
});

const DefaultLayout: React.FunctionComponent<DefaultLayoutProps> = ({ children }) => {
  return (
    <Root>
      <Header />
      <div className='main'>{children}</div>
    </Root>
  );
};

export default DefaultLayout;
