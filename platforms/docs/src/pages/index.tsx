import { styled, Button } from '@xl-vision/react';
import React from 'react';
import Link from 'next/link';
import { env } from '@xl-vision/utils';
import { NextPage } from 'next';
import Logo from '../components/Logo';
import Header from '../components/Header';
import { LocalizationContext } from '../components/LocalizationProvider';
import { ThemeContext } from '../components/ThemeProvider';
import Sponsorship from '../components/Sponsorship';

if (env.isBrowser) {
  // eslint-disable-next-line global-require
  require('particles.js');
}

const HeaderWrapper = styled(Header)(() => {
  return {
    '&>header': {
      background: 'transparent',
      boxShadow: 'none',
    },
  };
});

const Root = styled('div')(() => {
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'auto',
  };
});

const Main = styled('div')(({ theme }) => {
  return {
    position: 'relative',
    minHeight: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    '.logo': {
      height: 90,
      display: 'inline-flex',
      flexDirection: 'row',
      alignItems: 'center',
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
  };
});

const Particle = styled('div')(({ theme }) => {
  return {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.color.background.paper,
    zIndex: -1,
  };
});

const Home: NextPage = () => {
  const { locale } = React.useContext(LocalizationContext);

  const { isDark } = React.useContext(ThemeContext);

  React.useEffect(() => {
    const file = isDark ? 'particles-dark' : 'particles';

    window.particlesJS.load('particles', `/${file}.json`);

    return () => {
      const parent = document.querySelector('#particles');
      if (!parent) {
        return;
      }
      const array = window.pJSDom;
      for (let i = 0; i < array.length; i++) {
        const pJs = array[i];
        pJs.pJS.fn.vendors.destroypJS();
      }
      window.pJSDom = [];
    };
  }, [isDark]);

  return (
    <>
      <HeaderWrapper />
      <Particle id='particles' />
      <Root>
        <Main>
          <div className='logo'>
            <Logo />
            <span>Vision</span>
          </div>
          <div className='desc'>{locale.pages.index.desc}</div>
          <div className='action'>
            <Link href='/components' passHref={true}>
              <Button theme='primary'>{locale.pages.index.btnStart}</Button>
            </Link>
            <Button theme='default' target='_blank' href='https://github.com/xl-vision/xl-vision'>
              {locale.pages.index.btnGithub}
            </Button>
          </div>
        </Main>
        <Sponsorship />
      </Root>
    </>
  );
};

export default Home;
