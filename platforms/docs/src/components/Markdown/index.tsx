import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import PropTypes from 'prop-types';
import DemoBox from '../DemoBox';
import Wrapper from './Wrapper';
import pre from './pre';
import a from './a';
import code from './code';
import blockquote from './blockquote';
import table from './table';

export type MarkdownProps = {
  children: React.ReactNode;
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

const Markdown: React.FunctionComponent<MarkdownProps> = (props) => {
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
