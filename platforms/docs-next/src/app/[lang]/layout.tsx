import { Metadata } from 'next';
import { FC, ReactNode } from 'react';
import CssBaseline from '../../components/CssBaseline';
import LocalizationProvider from '../../components/LocalizationProvider';
import StyledComponentsRegistry from '../../components/StyledComponentsRegistry';
import ThemeProvider from '../../components/ThemeProvider';
import { defaultLang } from '../../locales';

export const metadata: Metadata = {
  icons: [
    {
      rel: 'icon',
      url: '/favicon.svg',
    },
  ],
};

const App: FC<{ children: ReactNode; params: Record<string, string> }> = ({ children, params }) => {
  return (
    <html lang={params.lang || defaultLang}>
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

export default App;
