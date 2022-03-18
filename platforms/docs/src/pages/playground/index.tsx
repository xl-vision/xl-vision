import { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { styled } from '@xl-vision/react';
import Header, { height } from '../../components/Header';
import { LocalizationContext } from '../../components/LocalizationProvider';

const Main = styled('div')(({ theme }) => {
  const { color } = theme;

  return {
    marginTop: height,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: '100%',

    '> *': {
      width: '50%',
      height: '100%',
    },

    '.editor': {
      borderRight: `1px solid ${color.divider}`,
    },
    '.preview': {
      width: '50%',
    },
  };
});

const Playground: NextPage = () => {
  const { locale } = React.useContext(LocalizationContext);

  return (
    <>
      <Head>
        <title>{locale.pages.index.title} | xl-vision</title>
      </Head>
      <Header />
      <Main>
        <LiveProvider code='<strong>Hello World!</strong>'>
          <div className='editor'>
            <LiveEditor />
          </div>
          <div className='preview'>
            <LivePreview />
            <LiveError />
          </div>
        </LiveProvider>
      </Main>
    </>
  );
};

export default Playground;
