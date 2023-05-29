import { Metadata } from 'next';
import { FC, ReactNode } from 'react';
import CssBaseline from '../components/CssBaseline';
import StyledComponentsRegistry from '../components/StyledComponentsRegistry';
import ThemeProvider from '../components/ThemeProvider';

export const metadata: Metadata = {
  icons: [
    {
      rel: 'icon',
      url: '/favicon.svg',
    },
  ],
};

const App: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <html lang='zh-CN'>
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

export default App;
