import React from 'react';
import { Button, styled, Icon, Tooltip, Dropdown, Row } from '@xl-vision/react';
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
import useSizeBelow from '../../hooks/useSizeBelow';

export const height = 60;

const { Col } = Row;

const Container = styled('div')(() => {
  return {
    position: 'fixed',
    top: 0,
    width: '100%',
    height,
    zIndex: 1000,
  };
});

const HeaderNav = styled('header')(({ theme }) => {
  const { color } = theme;

  const background = color.background.paper;

  const fontColor = color.getContrastText(background).text.primary;

  return {
    display: 'flex',
    alignItems: 'center',
    margin: 0,
    height,
    width: '100%',
    padding: '0 16px',
    backgroundColor: alpha(background, 0.72),
    color: fontColor,
    justifyContent: 'space-between',
    borderBottom: `1px solid ${color.divider}`,
    backdropFilter: 'blur(20px)',

    '.xl-button__root': {
      color: fontColor,
    },

    '.left': {
      display: 'flex',
      alignItems: 'center',

      button: {
        marginRight: 12,
      },
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
    flex: 1,
    padding: 0,
    marginLeft: 100,
    li: {
      a: {
        fontSize: 14,
        display: 'block',
        color: theme.color.text.primary,
        textDecoration: 'none',
        padding: '6px 12px',
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

  const isBelowMd = useSizeBelow('md');

  const { isDark, setDark } = theme;

  const handleTheme = React.useCallback(() => {
    setDark((prev) => !prev);
  }, [setDark]);

  const langs = React.useMemo(() => Object.keys(supportLocales), [supportLocales]);

  const handleLangChange = useConstantFn((lang: string) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: lang }).catch(() => {});
    Cookie.set('NEXT_LOCALE', lang, { expires: 30 });
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
    </>
  );

  return (
    <Container {...props}>
      <HeaderNav>
        <Row>
          <Col column={{ xs: 2, md: 0 }}>
            <Dropdown menus={mobileMenus} trigger='click'>
              <Button
                aria-label='Menus'
                variant='text'
                prefixIcon={
                  <Icon>
                    <MenuOutlined />
                  </Icon>
                }
              />
            </Dropdown>
          </Col>
        </Row>
        <div className='left'>
          <Link href='/' passHref={true}>
            <LogoWrapper>
              <Logo />
              {!isBelowMd && <span>xl vision</span>}
            </LogoWrapper>
          </Link>
        </div>
        {!isBelowMd && (
          <Menus>
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
          </Menus>
        )}
        <div>
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
              prefixIcon={
                <Icon>
                  <Translate />
                </Icon>
              }
              suffixIcon={
                <Icon>
                  <DownOutlined />
                </Icon>
              }
            >
              {!isBelowMd && locale.name}
            </Button>
          </Dropdown>
          <Tooltip content={locale.header.themeTooltip} placement='bottom' showDelay={1500}>
            <Button
              aria-label='Theme'
              variant='text'
              onClick={handleTheme}
              prefixIcon={<Icon>{isDark ? <LightTheme /> : <DarkTheme />}</Icon>}
            />
          </Tooltip>
          <Tooltip content={locale.header.githubTooltip} placement='bottom' showDelay={1500}>
            <Button
              aria-label='Github'
              variant='text'
              target='_black'
              href='https://github.com/xl-vision/xl-vision'
              rel='noopener'
              prefixIcon={
                <Icon>
                  <GithubFilled />
                </Icon>
              }
            />
          </Tooltip>
        </div>
      </HeaderNav>
    </Container>
  );
};

export default Header;
