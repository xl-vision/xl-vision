import React from 'react';
import { GetStaticProps, NextPage } from 'next';
import { defaultLanguage } from '@xl-vision/react/locale';
import dynamic from 'next/dynamic';
import { LayoutKey } from '../../../layout';
import { useLocale } from '../../../components/LocalizationProvider';

const localeMap: Record<string, React.ComponentType> = {
  'zh-CN': dynamic(() => import('./index.zh-CN.mdx')),
  'en-US': dynamic(() => import('./index.en-US.mdx')),
};

const Quickstart: NextPage = () => {
  const { language } = useLocale();

  const Component = localeMap[language] || localeMap[defaultLanguage];

  return <Component />;
};

export default Quickstart;

export const getStaticProps: GetStaticProps<{ layout: LayoutKey }> = () => {
  return {
    props: {
      layout: 'component',
    },
  };
};
