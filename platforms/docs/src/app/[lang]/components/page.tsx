'use client';

import DocsLayout from '@docs/components/DocsLayout';
import docs from '@docs/mdx/components/overview/index.en-US.mdx?locale';
import { componentRoutes } from '@docs/routes';

const Page = () => {
  return <DocsLayout basePath='components' docs={docs} routes={componentRoutes} />;
};

export default Page;
