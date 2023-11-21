import { ReactNode } from 'react';
import DocsLayout from '@docs/components/DocsLayout';
import { hookRoutes } from '@docs/routes';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <DocsLayout appendEn={false} basePath='hooks' routes={hookRoutes}>
      {children}
    </DocsLayout>
  );
};

export default Layout;
