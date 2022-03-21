import { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import { styled } from '@xl-vision/react';
import { useRouter } from 'next/router';
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
    return Buffer.from(defaultCode, 'base64').toString();
  }, [defaultCode]);

  const scripts = React.useMemo(() => {
    return {};
  }, []);

  return (
    <>
      <Head>
        <title>{locale.pages.index.title} | xl-vision</title>
      </Head>
      <Header />
      <Main>
        <Playground code={code} scripts={scripts} />
      </Main>
    </>
  );
};

export default PlaygroundPage;
