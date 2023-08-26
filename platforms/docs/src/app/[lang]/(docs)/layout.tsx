import { FC, ReactNode } from 'react';
import Markdown from '@docs/components/Markdown';

const Layout: FC<{ children: ReactNode; params: Record<string, string> }> = ({
  children,
  params,
}) => {
  return <Markdown>{children}</Markdown>;
};

export default Layout;
