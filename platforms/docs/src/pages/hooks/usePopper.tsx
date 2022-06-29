import { GetStaticProps, NextPage } from 'next';
import React from 'react';
import Docs from '@xl-vision/popper/__doc__/index.en-US.mdx?locale';
import { LayoutKey } from '../../layout';

const ComponentHome: NextPage = () => {
  return <Docs />;
};

export const getStaticProps: GetStaticProps<{ layout: LayoutKey }> = () => {
  return {
    props: {
      layout: 'hook',
    },
  };
};

export default ComponentHome;
