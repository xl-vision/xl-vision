import { Analytics } from '@vercel/analytics/react';
import { Metadata } from 'next';
import { FC, ReactNode } from 'react';
import BaiduAnalytics from '@docs/components/BaiduAnalytics';
import CssBaseline from '@docs/components/CssBaseline';
import GlobalStyle from '@docs/components/GlobalStyle';
import GoogleAnalytics from '@docs/components/GoogleAnalytics';
import Markdown from '@docs/components/Markdown';
import StyledComponentsRegistry from '@docs/components/StyledComponentsRegistry';
import ThemeProvider from '@docs/components/ThemeProvider';
import { Lang, locales, supportedLangs } from '@docs/locales';

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

const Layout: FC<{ children: ReactNode; params: Record<string, string> }> = ({
  children,
  params,
}) => {
  return (
    <html lang={params.lang}>
      <body>
        <StyledComponentsRegistry>
          <ThemeProvider>
            <CssBaseline />
            <GlobalStyle />
            <Markdown>{children}</Markdown>
          </ThemeProvider>
        </StyledComponentsRegistry>
        <BaiduAnalytics />
        <GoogleAnalytics />
        <Analytics />
      </body>
    </html>
  );
};

export default Layout;
