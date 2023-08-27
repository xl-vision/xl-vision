import DocsRouteRender from '@docs/components/DocsRouteRender';
import { componentRoutes } from '@docs/routes';

const Page = () => {
  return <DocsRouteRender basePath='components' routes={componentRoutes} />;
};

export default Page;
