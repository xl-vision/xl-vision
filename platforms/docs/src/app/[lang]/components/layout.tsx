import { ReactNode } from 'react';
import DocsLayout from '@docs/components/DocsLayout';
import { componentRoutes } from '@docs/routes';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <DocsLayout basePath='components' routes={componentRoutes}>
      {children}
    </DocsLayout>
  );
};

export default Layout;
