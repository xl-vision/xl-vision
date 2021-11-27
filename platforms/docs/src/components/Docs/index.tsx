import { defaultLanguage } from '@xl-vision/react/locale';
import React from 'react';
import { useLocale } from '../LocalizationProvider';

export type DocsProps = {
  locales: Record<string, React.ComponentType>;
};

const Docs: React.FunctionComponent<DocsProps> = ({ locales }) => {
  const { language } = useLocale();

  const Component = locales[language] || locales[defaultLanguage];

  if (!Component) {
    return null;
  }

  return <Component />;
};

export default Docs;
