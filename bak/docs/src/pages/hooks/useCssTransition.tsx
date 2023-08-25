import Docs from '@xl-vision/hooks/useCssTransition/__doc__/index.en-US.mdx?locale';
import { GetStaticProps, NextPage } from 'next';
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
