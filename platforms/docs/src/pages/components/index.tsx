import { GetStaticProps, NextPage } from 'next';
import EnUS from '../../docs/components/overview/index.en-US.mdx';
import { LayoutKey } from '../../layout';

const ComponentHome: NextPage = () => {
  return <EnUS />;
};

export const getStaticProps: GetStaticProps<{ layout: LayoutKey }> = () => {
  return {
    props: {
      layout: 'component',
    },
  };
};

export default ComponentHome;
