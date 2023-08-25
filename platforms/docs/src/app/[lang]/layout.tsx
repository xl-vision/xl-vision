import { Metadata } from 'next';
import { FC, ReactNode } from 'react';
import CssBaseline from '../../components/CssBaseline';
import StyledComponentsRegistry from '../../components/StyledComponentsRegistry';
import ThemeProvider from '../../components/ThemeProvider';
import { Lang, locales, supportedLangs } from '../../locales';

export const generateMetadata = async ({ params: { lang } }: { params: { lang: Lang } }) => {
  const locale = locales[lang];

  const metadata: Metadata = {
    keywords: locale.meta.keywords,
    description: locale.meta.description,
    title: {
      template: '%s | xl-vision',
      default: 'xl-vision',
    },
  };

  return metadata;
};

export const generateStaticParams = () => {
  return supportedLangs.map((lang) => ({ lang }));
};

const RootLayout: FC<{ children: ReactNode; params: Record<string, string> }> = ({
  children,
  params,
}) => {
  return (
    <html lang={params.lang}>
      <body>
        <StyledComponentsRegistry>
          <ThemeProvider>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
};

export default RootLayout;
