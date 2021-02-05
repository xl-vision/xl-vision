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
  const { children } = props;
  return <MDXProvider components={components}>{children}</MDXProvider>;
};

Markdown.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Markdown;
