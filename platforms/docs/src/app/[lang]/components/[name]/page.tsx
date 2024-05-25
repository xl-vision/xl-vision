import { FC } from 'react';
import Docs from '@docs/components/Docs';
import { Lang } from '@docs/locales';
import { componentRoutes } from '@docs/routes';
import createGenerateMetadata from '@docs/utils/createGenerateMetadata';
import { getAllLeftRoute } from '@docs/utils/route';

export const generateStaticParams = () => {
  return getAllLeftRoute(componentRoutes).map((it) => ({ name: it.name }));
};

export const generateMetadata = createGenerateMetadata(componentRoutes);

const Page: FC<{ params: { name: string; lang: Lang } }> = ({ params: { name, lang } }) => {
  return <Docs lang={lang} name={name} routes={componentRoutes} />;
};

export default Page;
