import { Metadata } from 'next';
import { FC, ReactNode } from 'react';
import CssBaseline from '../../components/CssBaseline';
import LocalizationProvider from '../../components/LocalizationProvider';
import StyledComponentsRegistry from '../../components/StyledComponentsRegistry';
import ThemeProvider from '../../components/ThemeProvider';
import { supportedLangs } from '../../locales';

export const metadata: Metadata = {
  icons: [
    {
      rel: 'icon',
      url: '/favicon.svg',
    },
  ],
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
            <LocalizationProvider>{children}</LocalizationProvider>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
};

export default RootLayout;
