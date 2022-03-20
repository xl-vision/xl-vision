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

const EXEC = `ReactDOM.render(React.createElement(Demo.default), document.querySelector('#sandbox'))`;

const PlaygroundPage: NextPage = () => {
  const { locale } = React.useContext(LocalizationContext);

  const { query } = useRouter();

  const defaultCode = query.code as string;

  const code = React.useMemo(() => {
    if (!defaultCode) {
      return [
        `import { Button } from '@xl-vision/react';`,
        '',
        `export default () => {`,
        `  return <Button>button</Button>`,
        `}`,
      ].join('\n');
    }
    return window.decodeURIComponent(defaultCode);
  }, [defaultCode]);

  const resources = React.useMemo(() => {
    return [
      'https://unpkg.com/react@17.0.2/umd/react.development.js',
      'https://unpkg.com/react-dom@17.0.2/umd/react-dom.development.js',
    ];
  }, []);

  return (
    <>
      <Head>
        <title>{locale.pages.index.title} | xl-vision</title>
      </Head>
      <Header />
      <Main>
        <Playground defaultCode={code} resources={resources} exec={EXEC} />
      </Main>
    </>
  );
};

export default PlaygroundPage;
