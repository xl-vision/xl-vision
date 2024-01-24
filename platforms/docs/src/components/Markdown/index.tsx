import type { MDXComponents } from 'mdx/types';
import { ReactNode } from 'react';
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

const components: MDXComponents = {
  DemoBox,
  wrapper: Wrapper,
  pre,
  a,
  blockquote,
  code,
  table,
};

export const useMDXComponents = (defaultComponents: MDXComponents): MDXComponents => {
  return {
    ...components,
    ...defaultComponents,
  };
};
