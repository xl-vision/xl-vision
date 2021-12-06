import { createGlobalStyles, CssBaseline } from '@xl-vision/react';
import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import LocalizationProvider, { useLocale } from '../components/LocalizationProvider';
import ThemeProvider from '../components/ThemeProvider';
import Markdown from '../components/Markdown';
import LayoutMap, { LayoutKey } from '../layout';
import BaiduAnalytics from '../components/BaiduAnalytics';
import GoogleAnalytics from '../components/GoogleAnalytics';

const GlobalStyle = createGlobalStyles(({ theme }) => {
  const { color } = theme;
  return {
    'html,body': {
      width: '100%',
      height: '100%',
    },
    '#__next': {
      height: '100%',
    },
    '::-webkit-scrollbar': {
      width: 8,
      height: 8,
      // backgroundColor: color.grey[500],
    },
    // '::-webkit-scrollbar-track': {
    //   boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
    // },
    '::-webkit-scrollbar-thumb': {
      backgroundColor: color.grey.A100,
      borderRadius: 5,
    },
  };
});

const App = ({ Component, pageProps }: AppProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { layout = 'default', ...others } = pageProps;

  const Layout = LayoutMap[layout as LayoutKey];

  return (
    <>
      <LocalizationProvider>
        <Meta />
        <ThemeProvider>
          <CssBaseline />
          <GlobalStyle />
          <Markdown>
            <Layout>
              <Component {...others} />
            </Layout>
          </Markdown>
        </ThemeProvider>
      </LocalizationProvider>
      <BaiduAnalytics />
      <GoogleAnalytics />
    </>
  );
};

export default App;

const Meta = () => {
  const { locale } = useLocale();

  const { meta } = locale;

  return (
    <Head>
      <meta name='keywords' content={meta.keywords.join(',')} />
      <meta name='description' content={meta.description} />
    </Head>
  );
};
