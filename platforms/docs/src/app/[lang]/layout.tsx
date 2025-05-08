import { Analytics } from '@vercel/analytics/react';
import { Metadata } from 'next';
import { FC, ReactNode, Suspense } from 'react';
import BaiduAnalytics from '@docs/components/BaiduAnalytics';
import CssBaseline from '@docs/components/CssBaseline';
import GlobalStyle from '@docs/components/GlobalStyle';
import GoogleAnalytics from '@docs/components/GoogleAnalytics';
import StyleRegistry from '@docs/components/StyleRegistry';
import ThemeProvider from '@docs/components/ThemeProvider/ThemeProvider';
import { Lang, locales, supportedLangs } from '@docs/locales';

export const generateMetadata = async ({ params }: { params: Promise<{ lang: Lang }> }) => {
  const { lang } = await params;

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

const Layout: FC<{ children: ReactNode; params: Promise<{ lang: Lang }> }> = async ({
  children,
  params,
}) => {
  const { lang } = await params;

  return (
    <html lang={lang}>
      <body>
        <StyleRegistry>
          <ThemeProvider>
            <CssBaseline />
            <GlobalStyle />
            <Suspense>{children}</Suspense>
          </ThemeProvider>
        </StyleRegistry>
        <BaiduAnalytics />
        <GoogleAnalytics />
        <Analytics />
      </body>
    </html>
  );
};

export default Layout;
