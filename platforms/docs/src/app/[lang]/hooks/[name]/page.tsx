import { FC } from 'react';
import Docs from '@docs/components/Docs';
import { hookRoutes } from '@docs/routes';
import createGenerateMetadata from '@docs/utils/createGenerateMetadata';
import { getAllLeftRoute } from '@docs/utils/route';

export const generateStaticParams = () => {
  return getAllLeftRoute(hookRoutes).map((it) => ({ name: it.name }));
};

export const generateMetadata = createGenerateMetadata(hookRoutes);

const Page: FC<{ params: Promise<{ name: string }> }> = async ({ params }) => {
  const { name } = await params;

  return <Docs name={name} routes={hookRoutes} />;
};

export default Page;
