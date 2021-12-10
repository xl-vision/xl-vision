import { styled, Button } from '@xl-vision/react';
import React from 'react';
import Link from 'next/link';
import { NextPage } from 'next';
import Head from 'next/head';
import Logo from '../components/Logo';
import Header from '../components/Header';
import { LocalizationContext } from '../components/LocalizationProvider';
import Sponsorship from '../components/Sponsorship';
import Footer from '../components/Footer';

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
    background: theme.color.background.paper,
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
    backgroundColor: theme.color.background.paper,
    marginTop: 32,
  };
});

const Home: NextPage = () => {
  const { locale } = React.useContext(LocalizationContext);

  return (
    <>
      <Head>
        <title>{locale.pages.index.title} | xl-vision</title>
      </Head>
      <HeaderWrapper />
      <Main>
        <div className='logo'>
          <Logo />
          <span>Vision</span>
        </div>
        <div className='desc'>{locale.pages.index.desc}</div>
        <div className='action'>
          <Link href='/components' passHref={true}>
            <Button color='primary' rel='noopener'>
              {locale.pages.index.btnStart}
            </Button>
          </Link>
          <Button color='default' target='_blank' href='https://github.com/xl-vision/xl-vision'>
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
