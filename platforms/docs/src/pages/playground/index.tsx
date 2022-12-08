import { styled } from '@xl-vision/react';
import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useContext, useMemo } from 'react';
import { LocalizationContext } from '../../components/LocalizationProvider';
import Playground from '../../components/Playground';
import { LayoutKey } from '../../layout';

const Main = styled('div')(() => {
  return {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: '100%',
  };
});

const PlaygroundPage: NextPage = () => {
  const { locale } = useContext(LocalizationContext);

  const { query } = useRouter();

  const defaultCode = query.code as string;

  const code = useMemo(() => {
    if (!defaultCode) {
      return [
        ``,
        `import { Button } from '@xl-vision/react';`,
        '',
        `export default () => {`,
        `  return <Button>button</Button>`,
        `}`,
      ].join('\n');
    }
    return Buffer.from(defaultCode, 'base64').toString();
  }, [defaultCode]);

  const scripts = useMemo(() => {
    return {};
  }, []);

  const titleContent = `${locale.pages.playground.title} | xl-vision`;

  return (
    <>
      <Head>
        <title>{titleContent}</title>
      </Head>
      <Main>
        <Playground code={code} scripts={scripts} />
      </Main>
    </>
  );
};

export const getStaticProps: GetStaticProps<{ layout: LayoutKey }> = () => {
  return {
    props: {
      layout: 'header',
    },
  };
};

export default PlaygroundPage;
