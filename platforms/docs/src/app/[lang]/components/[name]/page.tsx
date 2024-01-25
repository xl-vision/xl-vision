import { FC } from 'react';
import Docs from '@docs/components/Docs';
import { componentRoutes } from '@docs/routes';
import createGenerateMetadata from '@docs/utils/createGenerateMetadata';

export const generateMetadata = createGenerateMetadata(componentRoutes);

const Page: FC<{ params: { name: string } }> = ({ params: { name } }) => {
  return <Docs name={name} routes={componentRoutes} />;
};

export default Page;
