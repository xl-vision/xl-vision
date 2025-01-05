'use client';

import { MenuOutlined } from '@xl-vision/icons';
import { styled, Button, Dropdown } from '@xl-vision/react';
import { useRouter } from 'next/navigation';
import Footer from '@docs/components/Footer';
import Header, { HEADER_HEIGHT } from '@docs/components/Header';
import LocaleLink from '@docs/components/LocaleLink';
import Logo from '@docs/components/Logo';
import Sponsorship from '@docs/components/Sponsorship';
import useLocale from '@docs/hooks/useLocale';

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

// const G = createGlobalStyles`
//   body {
//   font-size: 21px;
//   backgroud-color: ${p => {
//     console.log(p, 'theme')
//     return 'red'
//   }};
//   }
// `

const Home = () => {
  const { locale, lang } = useLocale();

  const router = useRouter();

  const mobileMenus = (
    <Dropdown
      menus={
        <>
          <Dropdown.Item onClick={() => router.push(`/${lang}/components`)}>
            {locale.header.component}
          </Dropdown.Item>
          <Dropdown.Item onClick={() => router.push(`/${lang}/hooks`)}>
            {locale.header.hooks}
          </Dropdown.Item>
        </>
      }
    >
      <Button prefixIcon={<MenuOutlined />} variant='text' />
    </Dropdown>
  );

  return (
    <>
      <Header mobileMenus={mobileMenus} />
      <Main>
        <div className='logo'>
          <Logo />
          <span>Vision</span>
        </div>
        <div className='desc'>{locale.pages.index.desc}</div>
        <div className='action'>
          <LocaleLink href='/components'>
            <Button color='primary'>{locale.pages.index.btnStart}</Button>
          </LocaleLink>
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
