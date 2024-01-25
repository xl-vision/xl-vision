import { FC, ReactNode } from 'react';
import DocsLayout from '@docs/components/DocsLayout';
import { componentRoutes } from '@docs/routes';
import { extractRoutes } from '@docs/utils/route';

const extractedRoutes = extractRoutes(componentRoutes);

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <DocsLayout basePath='components' routes={extractedRoutes}>
      {children}
    </DocsLayout>
  );
};

export default Layout;
