import DocsLayout from '@docs/components/DocsLayout';
import { componentRoutes } from '@docs/routes';
import createGenerateMetadata from '@docs/utils/createGenerateMetadata';
import Docs from './(_private)/Docs';

export const generateMetadata = createGenerateMetadata(componentRoutes, '');

const Page = () => {
  return (
    <DocsLayout basePath='components' routes={componentRoutes}>
      <Docs />
    </DocsLayout>
  );
};

export default Page;
