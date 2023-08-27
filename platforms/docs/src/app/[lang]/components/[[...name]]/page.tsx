'use client';

import DocsLayout from '@docs/components/DocsLayout';
import { Lang } from '@docs/locales';
import { componentRoutes } from '@docs/routes';
import { getRouteNameMap } from '@docs/utils/route';

const routeMap = getRouteNameMap(componentRoutes);

export const generateMetadata = async ({
  params: { name, lang },
}: {
  params: { name?: Array<string>; lang: Lang };
}) => {
  let key: string | undefined;

  if (!name) {
    key = '';
  } else if (name.length === 1) {
    key = name[0];
  }

  if (key !== undefined) {
    return {
      title: routeMap[key].titleMap[lang],
    };
  }

  return {};
};

const Page = () => {
  return <DocsLayout basePath='components' routes={componentRoutes} />;
};

export default Page;
