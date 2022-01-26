import { styled, CollapseTransition, Button, useTheme } from '@xl-vision/react';
import { useRouter } from 'next/router';
import React from 'react';
import Aside from '../components/Aside';
import Footer from '../components/Footer';
import Header, { height } from '../components/Header';
import { useLocale } from '../components/LocalizationProvider';
import { Layout } from './Layout';

const asideWidth = 280;

const Root = styled('div')(({ theme }) => {
  return {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: theme.color.background.paper,
    '.menu-button': {
      position: 'fixed',
      zIndex: 1000,
      right: 0,
      top: height + 10,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
    '.mobile-menus': {
      position: 'fixed',
      top: height,
      width: '100%',
      height: '100%',
      overflowY: 'auto',
      zIndex: 10,
    },
    '.aside': {
      '&-enter-active, &-leave-active': {
        transition: 'height 0.4s ease',
      },
    },
  };
});

const AsideWrapper = styled(Aside)(({ theme }) => {
  const { breakpoints } = theme;

  const { values, unit } = breakpoints;

  return {
    // '@media(max-width: 768px)': {
    //   borderBottom: `1px solid ${theme.color.divider}`,
    // },
    width: '100%',
    backgroundColor: theme.color.background.paper,

    [`@media(min-width: ${values.md}${unit})`]: {
      position: 'fixed',
      top: height,
      bottom: 0,
      width: asideWidth,
      borderRight: `1px solid ${theme.color.divider}`,
      overflowY: 'hidden',
      ':hover': {
        overflowY: 'auto',
      },
    },
  };
});

const MainWrapper = styled('div')(({ theme }) => {
  const { breakpoints } = theme;

  const { values, unit } = breakpoints;

  const mobileWidth = `${values.md}${unit}`;

  return {
    // padding: '0 16px',
    marginTop: height,
    backgroundColor: theme.color.background.paper,
    overflowY: 'auto',
    [`@media(min-width: ${mobileWidth})`]: {
      marginTop: 0,
      position: 'fixed',
      top: height,
      bottom: 0,
      left: asideWidth,
      right: 0,
    },
  };
});

const ComponentLayout: Layout = ({ children }) => {
  const { locale } = useLocale();

  const asideRef = React.useRef<HTMLDivElement>(null);

  const { pathname } = useRouter();

  const [asideVisible, setAsideVisible] = React.useState(false);

  const theme = useTheme();

  const handleAsideVisible = React.useCallback((e: React.MouseEvent) => {
    setAsideVisible((prev) => !prev);
    e.stopPropagation();
  }, []);

  // 滚回顶部
  React.useEffect(() => {
    asideRef.current?.scrollTo({ top: 0, left: 0 });
  }, [pathname]);

  React.useEffect(() => {
    const fn = () => {
      setAsideVisible(false);
    };
    window.addEventListener('click', fn);
    return () => {
      window.removeEventListener('click', fn);
    };
  }, []);

  return (
    <Root>
      <Header />
      <Button className='menu-button md-down' onClick={handleAsideVisible} color='primary'>
        {locale.layout.component.mobileAsideButton}
      </Button>
      <div
        className='mobile-menus md-down'
        style={{
          pointerEvents: asideVisible ? undefined : 'none',
          backgroundColor: asideVisible ? theme.color.background.paper : 'transparent',
        }}
      >
        <CollapseTransition in={asideVisible} transitionClasses='aside'>
          <AsideWrapper routeName='components' />
        </CollapseTransition>
      </div>
      <AsideWrapper className='md-up' routeName='components' />
      <MainWrapper ref={asideRef} style={{ overflowY: asideVisible ? 'hidden' : undefined }}>
        {children}
        <Footer />
      </MainWrapper>
    </Root>
  );
};

export default ComponentLayout;
