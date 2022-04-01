import React from 'react';
import { MDXProvider, Components } from '@mdx-js/react';
import PropTypes from 'prop-types';
import DemoBox from '../DemoBox';
import Wrapper from './Wrapper';
import pre from './pre';
import a from './a';
import blockquote from './blockquote';
import inlineCode from './inlineCode';
import table from './table';

export type MarkdownProps = {
  children: React.ReactNode;
  className?: string;
};

const components: Components = {
  DemoBox,
  wrapper: Wrapper,
  pre,
  a,
  blockquote,
  inlineCode,
  table,
};

const Markdown: React.FunctionComponent<MarkdownProps> = (props) => {
  const { children, ...others } = props;
  return (
    <MDXProvider {...others} components={components}>
      {children}
    </MDXProvider>
  );
};

Markdown.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Markdown;
