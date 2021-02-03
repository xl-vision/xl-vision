import React from 'react';
import { MDXProvider, Components } from '@mdx-js/react';
import DemoBox from '../DemoBox';
import Wrapper from './Wrapper';

export type MarkdownProps = {
  children: React.ReactNode;
};

const components: Components = {
  DemoBox,
  wrapper: Wrapper,
};

const Markdown: React.FunctionComponent<MarkdownProps> = (props) => (
  <MDXProvider components={components}>
    <div {...props} />
  </MDXProvider>
);

export default Markdown;
