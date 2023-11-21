import { warning } from '@xl-vision/utils';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { locales, defaultLang, supportedLangs, Lang } from '../locales';

const useLocale = () => {
  const { lang } = useParams<{ lang: Lang }>();

  const actualLang = useMemo(() => {
    if (supportedLangs.includes(lang)) {
      return lang;
    }
    warning(
      true,
      `The specified lang '%s' has no corresponding locale configuration, please provide the corresponding locale file, otherwise the default language (en-US) will be used`,
      lang,
    );

    return defaultLang;
  }, [lang]);

  return {
    locale: locales[actualLang],
    lang: actualLang,
  };
};

export default useLocale;
