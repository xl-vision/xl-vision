import React from 'react';
import { GetStaticProps, NextPage } from 'next';
import { LayoutKey } from '../../../layout';
import zhCN from './index.zh_CN.mdx';
import enUS from './index.en_US.mdx';

const localeMap: Record<string, React.ComponentType> = {
  zh_CN: zhCN,
  'en-US': enUS,
};

const Quickstart: NextPage = () => {

  const {} = React.useContext(Lo)

};

export default Quickstart;

export const getStaticProps: GetStaticProps<{ layout: LayoutKey }> = () => {
  return {
    props: {
      layout: 'component',
    },
  };
};
