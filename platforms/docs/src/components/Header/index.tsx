import React from 'react';
import { Button, styled, Icon, Tooltip, Dropdown } from '@xl-vision/react';
import { DownOutlined, GithubFilled } from '@xl-vision/icons';
import { darken, lighten } from '@xl-vision/react/utils/color';
import Link from 'next/link';
import { useConstantFn } from '@xl-vision/hooks';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';
import LightTheme from './LightTheme';
import DarkTheme from './DarkTheme';
import Translate from './Translate';
import { ThemeContext } from '../ThemeProvider';
import { LocalizationContext } from '../LocalizationProvider';
import Logo from '../Logo';

const Container = styled('div')(() => {
  return {
    width: '100%',
    height: '60px',
  };
});

const HeaderNav = styled('header')<{ isDark: boolean }>(({ theme, styleProps }) => {
  const { isDark } = styleProps;

  const { color } = theme;

  const background = (isDark ? darken : lighten)(color.background.paper, 0.1);

  const fontColor = color.getContrastText(background).text.primary;

  return {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    height: '60px',
    // borderBottom: `1px solid ${theme.color.divider}`,
    display: 'flex',
    alignItems: 'center',
    margin: 0,
    padding: '0 16px',
    background,
    color: fontColor,
    justifyContent: 'space-between',
    ...theme.elevations(4),

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

const Header: React.FunctionComponent<React.HTMLAttributes<HTMLElement>> = (props) => {
  const theme = React.useContext(ThemeContext);
  const { supportLocales, locale } = React.useContext(LocalizationContext);
  const router = useRouter();

  const { isDark, setDark } = theme;

  const handleTheme = React.useCallback(() => {
    setDark((prev) => !prev);
  }, [setDark]);

  const langs = React.useMemo(() => Object.keys(supportLocales), [supportLocales]);

  const handleLangChange = useConstantFn((lang: string) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: lang }).catch(() => {});
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    Cookie.set('NEXT_LOCALE', lang, { expires: 30 });
  });

  return (
    <Container {...props}>
      <HeaderNav styleProps={{ isDark }}>
        <Link href='/' passHref={true}>
          <LogoWrapper>
            <Logo />
            <span>xl vision</span>
          </LogoWrapper>
        </Link>
        <Menus>
          <li>
            <Link href='/'>
              <a>{locale.header.index}</a>
            </Link>
          </li>
          <li>
            <Link href='/components'>
              <a>{locale.header.component}</a>
            </Link>
          </li>
          <li>
            <Link href='/hooks'>
              <a>{locale.header.hooks}</a>
            </Link>
          </li>
        </Menus>
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
            <span>
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
                {locale.name}
              </Button>
            </span>
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
