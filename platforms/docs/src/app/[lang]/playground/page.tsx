import { Lang, locales } from '@docs/locales';
export { default } from './_components/Playground';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{
    lang: Lang;
  }>;
}) => {
  const { lang } = await params;

  return {
    title: locales[lang].pages.playground.title,
  };
};
