import { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import { Dropdown, styled } from '@xl-vision/react';
import Header, { height } from '../../components/Header';
import { LocalizationContext } from '../../components/LocalizationProvider';
import Playground from '../../components/Playground';
import { useRouter } from 'next/router';

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

  const { query } = useRouter();

  const defaultCode = query.code as string;

  const code = React.useMemo(() => {
    if (!defaultCode) {
      return [
        `import React from 'react';`,
        `import { Button } from '@xl-vision/react';`,
        '',
        `export default () => {`,
        `  return <Button>button</Button>`,
        `}`,
      ].join('\n');
    }
    return window.decodeURIComponent(defaultCode);
  }, [defaultCode]);

  const scripts = React.useMemo(() => {
    return {
      react: 'https://unpkg.com/react@17.0.2/umd/react.development.js?callback=defined',
      'react-dom':
        'https://unpkg.com/react-dom@17.0.2/umd/react-dom.development.js?callback=defined',
      '@xl-vision/react':
        'https://unpkg.com/@xl-vision/react@0.1.1-alpha.15/dist/index.production.min.js?callback=defined',
    };
  }, []);

  return (
    <>
      <Head>
        <title>{locale.pages.index.title} | xl-vision</title>
      </Head>
      <Header />
      <Main>
        <Playground defaultCode={code} scripts={scripts} />
      </Main>
    </>
  );
};

export default PlaygroundPage;
