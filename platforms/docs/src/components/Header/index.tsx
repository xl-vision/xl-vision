'use client';

import { useConstantFn } from '@xl-vision/hooks';
import { DownOutlined, GithubFilled, MenuOutlined } from '@xl-vision/icons';
import { Button, styled, Tooltip, Dropdown } from '@xl-vision/react';
import { usePathname, useRouter } from 'next/navigation';
import { FC, HTMLAttributes, useCallback } from 'react';
import DarkTheme from './DarkTheme';
import LightTheme from './LightTheme';
import Translate from './Translate';
import useLocale from '../../hooks/useLocale';
import { Lang, locales, supportedLangs } from '../../locales';
import LocaleLink from '../LocaleLink';
import Logo from '../Logo';
import useTheme from '../ThemeProvider/useTheme';

export const HEADER_HEIGHT = 60;

const Container = styled('div')(() => {
  return {
    position: 'sticky',
    top: 0,
    width: '100%',
    height: HEADER_HEIGHT,
    zIndex: 1000,
  };
});

const HeaderNav = styled('header')(({ theme }) => {
  const { colors, sizes } = theme;

  const background = colors.background.paper;

  const fontColor = colors.getContrastText(background).primary;

  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 0,
    height: HEADER_HEIGHT,
    width: '100%',
    padding: '0 16px',
    // backgroundColor: alpha(background, 0.72),
    color: fontColor,
    borderBottom: `${sizes.middle.border}px solid ${colors.divider.primary}`,
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

const LogoWrapper = styled(LocaleLink)(({ theme }) => {
  return {
    display: 'inline-flex',
    height: '100%',
    alignItems: 'center',
    textDecoration: 0,
    color: theme.colors.text.primary,

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
        color: theme.colors.text.primary,
        textDecoration: 'none',
        padding: '0 6px',
        transition: theme.transitions.standard('all'),
        '&.active, &:hover': {
          color: theme.colors.themes.primary.foreground.hover,
        },
      },
    },
  };
});

const MobileDropdownItem = styled(Dropdown.Item)(({ theme }) => {
  const { themes } = theme.colors;
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
        backgroundColor: themes.primary.foreground.active,
        color: themes.primary.text.primary,
      },
    },
  };
});

const langRegex = new RegExp(`^/(${supportedLangs.map((it) => it.replace(/-/g, '-')).join('|')})`);

const Header: FC<HTMLAttributes<HTMLElement>> = (props) => {
  const theme = useTheme();
  const { locale, lang } = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const { isDark, setDark } = theme;

  const handleTheme = useCallback(() => {
    setDark((prev) => !prev);
  }, [setDark]);

  const handleLangChange = useConstantFn((_lang: Lang) => {
    const newPathname = pathname.replace(langRegex, `/${_lang}`);

    if (newPathname === pathname) {
      return;
    }

    router.push(newPathname);
  });

  const setActiveClassName = useConstantFn((target: string) => {
    return pathname.startsWith(`/${lang}/${target}`) ? 'active' : '';
  });

  const mobileMenus = (
    <>
      <MobileDropdownItem className={setActiveClassName('components')}>
        <LocaleLink href='/components'>{locale.header.component}</LocaleLink>
      </MobileDropdownItem>
      <MobileDropdownItem className={setActiveClassName('hooks')}>
        <LocaleLink href='/hooks'>{locale.header.hooks}</LocaleLink>
      </MobileDropdownItem>
      <MobileDropdownItem className={setActiveClassName('playground')}>
        <LocaleLink href='/playground'>{locale.header.playground}</LocaleLink>
      </MobileDropdownItem>
    </>
  );

  return (
    <Container {...props}>
      <HeaderNav>
        <div className='left'>
          <Dropdown menus={mobileMenus} trigger='click'>
            <Button
              aria-label='Menus'
              className='md-down'
              prefixIcon={<MenuOutlined />}
              variant='text'
            />
          </Dropdown>
          <LogoWrapper href='/'>
            <Logo />
            <span className='sm-up'>xl vision</span>
          </LogoWrapper>
        </div>
        <div className='right'>
          <Menus className='md-up'>
            <li>
              <LocaleLink className={setActiveClassName('components')} href='/components'>
                {locale.header.component}
              </LocaleLink>
            </li>
            <li>
              <LocaleLink className={setActiveClassName('hooks')} href='/hooks'>
                {locale.header.hooks}
              </LocaleLink>
            </li>
            <li>
              <LocaleLink className={setActiveClassName('playground')} href='/playground'>
                {locale.header.playground}
              </LocaleLink>
            </li>
          </Menus>
          <Dropdown
            menus={
              <>
                {supportedLangs.map((it) => (
                  <Dropdown.Item key={it} onClick={() => handleLangChange(it)}>
                    {locales[it].name}
                  </Dropdown.Item>
                ))}
              </>
            }
          >
            <Button
              aria-label='Language'
              prefixIcon={<Translate />}
              suffixIcon={<DownOutlined />}
              variant='text'
            >
              <span className='sm-up'>{locale.name}</span>
            </Button>
          </Dropdown>
          <Tooltip
            content={locale.header.themeTooltip}
            hoverOptions={{ delay: { open: 1500 } }}
            placement='bottom'
          >
            <Button
              aria-label='Theme'
              prefixIcon={isDark ? <LightTheme /> : <DarkTheme />}
              variant='text'
              onClick={handleTheme}
            />
          </Tooltip>
          <Tooltip
            content={locale.header.githubTooltip}
            hoverOptions={{ delay: { open: 1500 } }}
            placement='bottom'
          >
            <Button
              aria-label='Github'
              href='https://github.com/xl-vision/xl-vision'
              prefixIcon={<GithubFilled />}
              rel='noopener'
              target='_black'
              variant='text'
            />
          </Tooltip>
        </div>
      </HeaderNav>
    </Container>
  );
};

export default Header;
