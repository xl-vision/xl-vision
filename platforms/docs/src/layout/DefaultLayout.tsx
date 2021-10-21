import { styled } from '@xl-vision/react';
import React from 'react';
import Header from '../components/Header';

export type DefaultLayoutProps = {
  children: React.ReactNode;
};

const Root = styled('div')(() => {
  return {};
});

const DefaultLayout: React.FunctionComponent<DefaultLayoutProps> = ({ children }) => {
  return (
    <Root>
      <Header />
      {children}
    </Root>
  );
};

export default DefaultLayout;
