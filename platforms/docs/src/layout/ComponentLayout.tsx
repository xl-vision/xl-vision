import { styled, Row, CollapseTransition, Button } from '@xl-vision/react';
import React from 'react';
import Aside from '../components/Aside';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useLocale } from '../components/LocalizationProvider';
import { Layout } from './Layout';

const { useBreakPoints } = Row;

const asideWidth = 280;

const AsideWrapper = styled(Aside)(({ theme }) => {
  return {
    padding: '0 12px',
    // '@media(max-width: 768px)': {
    //   borderBottom: `1px solid ${theme.color.divider}`,
    // },
    '@media(min-width: 768px)': {
      position: 'fixed',
      top: 60,
      bottom: 0,
      overflowY: 'hidden',
      width: asideWidth,
      borderRight: `1px solid ${theme.color.divider}`,
      ':hover': {
        overflowY: 'auto',
      },
    },
  };
});

const MainWrapper = styled('div')(() => {
  return {
    // padding: '0 16px',
    '@media(min-width: 768px)': {
      position: 'fixed',
      top: 60,
      bottom: 0,
      left: asideWidth,
      right: 0,
      overflowY: 'auto',
    },
  };
});

const Root = styled('div')(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    '.aside': {
      '&-enter-active, &-leave-active': {
        transition: 'height 0.4s ease',
      },
    },
  };
});

const MobileMenuButtonWrapper = styled('div')(() => {
  return {
    position: 'fixed',
    zIndex: 1000,
    top: 70,
    right: 0,
    button: {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
  };
});

const ComponentLayout: Layout = ({ children }) => {
  const breakPoints = useBreakPoints();

  const { locale } = useLocale();

  const [asideVisible, setAsideVisible] = React.useState(false);

  const isBelowMd = React.useMemo(() => {
    const md = breakPoints.find((it) => it[0] === 'md');
    if (md) {
      return !md[1];
    }
    return false;
  }, [breakPoints]);

  const handleAsideVisible = React.useCallback((e: React.MouseEvent) => {
    setAsideVisible((prev) => !prev);
    e.stopPropagation();
  }, []);

  React.useEffect(() => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
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
      {isBelowMd ? (
        <>
          <MobileMenuButtonWrapper>
            <Button onClick={handleAsideVisible} theme='primary'>
              {locale.layout.component.mobileAsideButton}
            </Button>
          </MobileMenuButtonWrapper>
          <CollapseTransition in={asideVisible} transitionClasses='aside'>
            <AsideWrapper routeName='components' />
          </CollapseTransition>
        </>
      ) : (
        <AsideWrapper routeName='components' />
      )}
      <MainWrapper>
        {children}
        <Footer />
      </MainWrapper>
    </Root>
  );
};

export default ComponentLayout;
