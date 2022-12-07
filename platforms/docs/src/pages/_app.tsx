import { createGlobalStyles, CssBaseline } from '@xl-vision/react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import LocalizationProvider, { useLocale } from '../components/LocalizationProvider';
import ThemeProvider from '../components/ThemeProvider';
import Markdown from '../components/Markdown';
import LayoutMap, { LayoutKey } from '../layout';
import BaiduAnalytics from '../components/BaiduAnalytics';
import GoogleAnalytics from '../components/GoogleAnalytics';

const GlobalStyle = createGlobalStyles(({ theme }) => {
  const { color, breakpoints } = theme;

  const { values, unit } = breakpoints;

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
    '.sm-down': {
      [`@media (min-width: ${values.sm + 1}${unit})`]: {
        display: 'none !important',
      },
    },
    '.sm-up': {
      [`@media (max-width: ${values.sm}${unit})`]: {
        display: 'none !important',
      },
    },
    '.md-down': {
      [`@media (min-width: ${values.md + 1}${unit})`]: {
        display: 'none !important',
      },
    },
    '.md-up': {
      [`@media (max-width: ${values.md}${unit})`]: {
        display: 'none !important',
      },
    },
  };
});

const App = ({ Component, pageProps }: AppProps<{ [key: string]: unknown }>) => {
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
      <meta content={meta.keywords.join(',')} name='keywords' />
      <meta content={meta.description} name='description' />
    </Head>
  );
};
