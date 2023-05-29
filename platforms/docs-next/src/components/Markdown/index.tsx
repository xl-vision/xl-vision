import { MDXProvider } from '@mdx-js/react';
import PropTypes from 'prop-types';
import { ReactNode, FC } from 'react';
import a from './a';
import blockquote from './blockquote';
import code from './code';
import pre from './pre';
import table from './table';
import Wrapper from './Wrapper';
import DemoBox from '../DemoBox';

export type MarkdownProps = {
  children: ReactNode;
  className?: string;
};

const components: any = {
  DemoBox,
  wrapper: Wrapper,
  pre,
  a,
  blockquote,
  code,
  table,
};

const Markdown: FC<MarkdownProps> = (props) => {
  const { children, ...others } = props;
  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    <MDXProvider {...others} components={components}>
      {children}
    </MDXProvider>
  );
};

Markdown.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Markdown;
