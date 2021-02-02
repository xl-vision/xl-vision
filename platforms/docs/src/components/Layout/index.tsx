import React from 'react';
import Markdown from '../Markdown';
import Demo from '../../views/Demo.md';

const Layout: React.FunctionComponent<{}> = () => (
  <Markdown>
    <Demo />
  </Markdown>
);

export default Layout;
