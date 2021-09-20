import { styled } from '@xl-vision/react';
import React from 'react';
import Aside from '../components/Aside';
import Footer from '../components/Footer';
import Header from '../components/Header';

export type DefaultLayoutProps = {
  children: React.ReactNode;
};

const asideWidth = 280;

const AsideWrapper = styled(Aside)(({ theme }) => {
  return {
    padding: '0 12px',
    '@media(max-width: 768px)': {
      borderBottom: `1px solid ${theme.color.divider}`,
    },
    '@media(min-width: 768px)': {
      position: 'fixed',
      top: 60,
      bottom: 0,
      overflowY: 'hidden',
      width: asideWidth,
      borderRight: `1px solid ${theme.color.divider}`,
      ':hover': {
        overflowY: 'auto',
      },
    },
  };
});

const MainWrapper = styled('div')(() => {
  return {
    padding: '0 16px',
    '@media(min-width: 768px)': {
      position: 'fixed',
      top: 60,
      bottom: 0,
      left: asideWidth,
      right: 0,
      overflowY: 'auto',
    },
  };
});

const DefaultLayout: React.FunctionComponent<DefaultLayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <AsideWrapper />
      <MainWrapper>
        {children}
        <Footer />
      </MainWrapper>
    </>
  );
};

export default DefaultLayout;
