import { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import { styled } from '@xl-vision/react';
import Header, { height } from '../../components/Header';
import { LocalizationContext } from '../../components/LocalizationProvider';
import Playground from '../../components/Playground';

const Main = styled('div')(() => {
  return {
    paddingTop: height,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: '100%',
  };
});

const PlaygroundPage: NextPage = () => {
  const { locale } = React.useContext(LocalizationContext);

  const code = 'export default () => <h1>hello</h1>';

  return (
    <>
      <Head>
        <title>{locale.pages.index.title} | xl-vision</title>
      </Head>
      <Header />
      <Main>
        <Playground defaultCode={code} />
      </Main>
    </>
  );
};

export default PlaygroundPage;
