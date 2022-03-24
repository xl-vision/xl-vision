import React from 'react';
import { Button, styled, Tooltip, Dropdown } from '@xl-vision/react';
import { DownOutlined, GithubFilled, MenuOutlined } from '@xl-vision/icons';
import Link from 'next/link';
import { useConstantFn } from '@xl-vision/hooks';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';
import { alpha } from '@xl-vision/react/utils/color';
import LightTheme from './LightTheme';
import DarkTheme from './DarkTheme';
import Translate from './Translate';
import { ThemeContext } from '../ThemeProvider';
import { useLocale } from '../LocalizationProvider';
import Logo from '../Logo';

export const height = 60;

const Container = styled('div')(() => {
  return {
    position: 'sticky',
    top: 0,
    width: '100%',
    height,
    zIndex: 1000,
  };
});

const HeaderNav = styled('header')(({ theme }) => {
  const { color, styleSize } = theme;

  const background = color.background.paper;

  const fontColor = color.getContrastColor(background).text.primary;

  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 0,
    height,
    width: '100%',
    padding: '0 16px',
    backgroundColor: alpha(background, 0.72),
    color: fontColor,
    borderBottom: `${styleSize.middle.border}px solid ${color.divider}`,
    backdropFilter: 'blur(20px)',

    '.left': {
      display: 'flex',
      alignItems: 'center',
    },

    '.right': {
      display: 'flex',
      alignItems: 'center',
    },

    '.xl-button__root': {
      color: fontColor,
    },
  };
});

const LogoWrapper = styled('a')(({ theme }) => {
  return {
    display: 'inline-flex',
    height: '100%',
    alignItems: 'center',
    textDecoration: 0,
    color: theme.color.text.primary,

    svg: {
      height: 32,
      width: 32,
    },
    span: {
      fontSize: 18,
      marginLeft: 12,
      fontWeight: theme.typography.fontWeight.bold,
    },
  };
});

const Menus = styled('ul')(({ theme }) => {
  return {
    listStyle: 'none',
    display: 'flex',
    alignItems: 'center',
    paddingRight: 16,
    li: {
      a: {
        fontSize: 14,
        display: 'block',
        color: theme.color.text.primary,
        textDecoration: 'none',
        padding: '0 6px',
        transition: theme.transition.standard('all'),
        '&.active, &:hover': {
          color: theme.color.themes.primary.color,
        },
      },
    },
  };
});

const MobileDropdownItem = styled(Dropdown.Item)(({ theme }) => {
  const { themes } = theme.color;
  return {
    minWidth: 250,
    a: {
      display: 'block',
      width: '100%',
      textDecoration: 'none',
      color: 'inherit',
      padding: '6px 0',
    },
    '&.active': {
      button: {
        backgroundColor: themes.primary.color,
        color: themes.primary.text.primary,
      },
    },
  };
});

const Header: React.FunctionComponent<React.HTMLAttributes<HTMLElement>> = (props) => {
  const theme = React.useContext(ThemeContext);
  const { supportLocales, locale } = useLocale();
  const router = useRouter();

  const { isDark, setDark } = theme;

  const handleTheme = React.useCallback(() => {
    setDark((prev) => !prev);
  }, [setDark]);

  const langs = React.useMemo(() => Object.keys(supportLocales), [supportLocales]);

  const handleLangChange = useConstantFn((lang: string) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: lang }).catch(() => {});
    Cookie.set('NEXT_LOCALE', lang, { expires: 30, sameSite: 'Strict' });
  });

  const setActiveClassName = useConstantFn((pathname: string) => {
    return router.pathname.startsWith(pathname) ? 'active' : '';
  });

  const mobileMenus = (
    <>
      <MobileDropdownItem className={setActiveClassName('/components')}>
        <Link href='/components'>
          <a>{locale.header.component}</a>
        </Link>
      </MobileDropdownItem>
      <MobileDropdownItem className={setActiveClassName('/hooks')}>
        <Link href='/hooks'>
          <a>{locale.header.hooks}</a>
        </Link>
      </MobileDropdownItem>
      <MobileDropdownItem className={setActiveClassName('/playground')}>
        <Link href='/playground'>
          <a>{locale.header.playground}</a>
        </Link>
      </MobileDropdownItem>
    </>
  );

  return (
    <Container {...props}>
      <HeaderNav>
        <div className='left'>
          <Dropdown menus={mobileMenus} trigger='click'>
            <Button
              className='md-down'
              aria-label='Menus'
              variant='text'
              prefixIcon={<MenuOutlined />}
            />
          </Dropdown>
          <Link href='/' passHref={true}>
            <LogoWrapper>
              <Logo />
              <span className='sm-up'>xl vision</span>
            </LogoWrapper>
          </Link>
        </div>
        <div className='right'>
          <Menus className='md-up'>
            <li>
              <Link href='/components'>
                <a className={setActiveClassName('/components')}>{locale.header.component}</a>
              </Link>
            </li>
            <li>
              <Link href='/hooks'>
                <a className={setActiveClassName('/hooks')}>{locale.header.hooks}</a>
              </Link>
            </li>
            <li>
              <Link href='/playground'>
                <a className={setActiveClassName('/playground')}>{locale.header.playground}</a>
              </Link>
            </li>
          </Menus>
          <Dropdown
            menus={
              <>
                {langs.map((lang) => (
                  <Dropdown.Item onClick={() => handleLangChange(lang)} key={lang}>
                    {supportLocales[lang].name}
                  </Dropdown.Item>
                ))}
              </>
            }
          >
            <Button
              aria-label='Language'
              variant='text'
              prefixIcon={<Translate />}
              suffixIcon={<DownOutlined />}
            >
              <span className='sm-up'>{locale.name}</span>
            </Button>
          </Dropdown>
          <Tooltip content={locale.header.themeTooltip} placement='bottom' showDelay={1500}>
            <Button
              aria-label='Theme'
              variant='text'
              onClick={handleTheme}
              prefixIcon={isDark ? <LightTheme /> : <DarkTheme />}
            />
          </Tooltip>
          <Tooltip content={locale.header.githubTooltip} placement='bottom' showDelay={1500}>
            <Button
              aria-label='Github'
              variant='text'
              target='_black'
              href='https://github.com/xl-vision/xl-vision'
              rel='noopener'
              prefixIcon={<GithubFilled />}
            />
          </Tooltip>
        </div>
      </HeaderNav>
    </Container>
  );
};

export default Header;
