import { FC } from 'react';
import Docs from '@docs/components/Docs';
import { hookRoutes } from '@docs/routes';
import createGenerateMetadata from '@docs/utils/createGenerateMetadata';

export const generateMetadata = createGenerateMetadata(hookRoutes);

const Page: FC<{ params: { name: string } }> = ({ params: { name } }) => {
  return <Docs name={name} routes={hookRoutes} />;
};

export default Page;
