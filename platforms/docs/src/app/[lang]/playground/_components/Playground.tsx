'use client';

import { styled } from '@xl-vision/react';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import Header, { HEADER_HEIGHT } from '@docs/components/Header';
import InnerPlayground from '@docs/components/Playground';

const Main = styled('div')(() => {
  return {
    display: 'flex',
    flexDirection: 'row',
    height: `calc(100vh - ${HEADER_HEIGHT}px)`,
  };
});

const Root = styled('div')(({ theme }) => {
  return {
    backgroundColor: theme.colors.background.paper,
  };
});

const Playground = () => {
  const searchParams = useSearchParams();

  const defaultCode = searchParams.get('code');

  const code = useMemo(() => {
    if (!defaultCode) {
      return [
        `import React from 'react'`,
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

  return (
    <Root>
      <Header />
      <Main>
        <InnerPlayground code={code} scripts={scripts} />
      </Main>
    </Root>
  );
};

export default Playground;
