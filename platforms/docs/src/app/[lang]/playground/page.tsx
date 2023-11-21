import { Lang, locales } from '@docs/locales';
import Playground from './_components/Playground';

export const generateMetadata = ({
  params: { lang },
}: {
  params: {
    lang: Lang;
  };
}) => {
  return {
    title: locales[lang].pages.playground.title,
  };
};

export default Playground;
