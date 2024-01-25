import { FC, ReactNode } from 'react';
import DocsLayout from '@docs/components/DocsLayout';
import { hookRoutes } from '@docs/routes';
import { extractRoutes } from '@docs/utils/route';

const extractedRoutes = extractRoutes(hookRoutes);

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <DocsLayout appendEn={false} basePath='hooks' routes={extractedRoutes}>
      {children}
    </DocsLayout>
  );
};

export default Layout;
