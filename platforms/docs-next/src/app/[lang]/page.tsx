'use client';

import { styled, Button } from '@xl-vision/react';
import Head from 'next/head';
import Link from 'next/link';
import Footer from '../../components/Footer';
import Header, { HEADER_HEIGHT } from '../../components/Header';
import Logo from '../../components/Logo';
import Sponsorship from '../../components/Sponsorship';
import useLocale from '../../hooks/useLocale';

const HeaderWrapper = styled(Header)(() => {
  return {};
});

const Main = styled('div')(({ theme }) => {
  const { breakpoints } = theme;

  const { values, unit } = breakpoints;

  const mobileWidth = `${values.sm}${unit}`;

  return {
    position: 'relative',
    minHeight: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    background: theme.colors.background.paper,
    marginTop: -HEADER_HEIGHT,
    '.logo': {
      height: 90,
      display: 'inline-flex',
      flexDirection: 'row',
      alignItems: 'center',
      svg: {
        width: 90,
      },
      span: {
        fontSize: 80,
        fontWeight: theme.typography.fontWeight.bold,
        marginLeft: 16,
      },
    },
    '.desc': {
      marginTop: 12,
      fontSize: 20,
      fontWeight: theme.typography.fontWeight.medium,
    },
    '.action': {
      marginTop: 16,
      a: {
        margin: '0 16px',
      },
    },
    [`@media(max-width: ${mobileWidth})`]: {
      '.logo': {
        height: 50,
        svg: {
          width: 50,
        },
        span: {
          fontSize: 45,
        },
      },
      '.desc': {
        fontSize: 18,
      },
    },
  };
});

const FooterWrapper = styled(Footer)(({ theme }) => {
  return {
    backgroundColor: theme.colors.background.paper,
    marginTop: 32,
  };
});

const Home = () => {
  const { locale } = useLocale();

  const titleContent = `${locale.pages.index.title} | xl-vision`;

  return (
    <>
      <Head>
        <title>{titleContent}</title>
      </Head>
      <HeaderWrapper />
      <Main>
        <div className='logo'>
          <Logo />
          <span>Vision</span>
        </div>
        <div className='desc'>{locale.pages.index.desc}</div>
        <div className='action'>
          <Link href='/components'>
            <Button color='primary'>{locale.pages.index.btnStart}</Button>
          </Link>
          <Button
            color='default'
            href='https://github.com/xl-vision/xl-vision'
            rel='noopener'
            target='_blank'
          >
            {locale.pages.index.btnGithub}
          </Button>
        </div>
      </Main>
      <Sponsorship />
      <FooterWrapper />
    </>
  );
};

export default Home;
