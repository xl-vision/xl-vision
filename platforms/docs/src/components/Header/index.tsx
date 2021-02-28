import React from 'react';
import { Button, styled } from '@xl-vision/react';
import { ThemeContext } from '../ThemeProvider';

const Container = styled('div')(() => {
  return {
    width: '100%',
    height: '60px',
  };
});

const HeaderNav = styled('header')(({ theme }) => {
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
    background: `${theme.color.background}`,
    justifyContent: 'space-between',
    ...theme.elevations(2),
  };
});

const Logo = styled('div')`
  font-size: 18px;
  font-weight: bolder;
`;

const Header = () => {
  const theme = React.useContext(ThemeContext);

  const handleTheme = React.useCallback(() => {
    theme.setDark(!theme.isDark);
  }, [theme]);

  return (
    <Container>
      <HeaderNav>
        <Logo>XL-VISION</Logo>
        <div>
          <Button theme='primary' variant='outlined' onClick={handleTheme}>
            {theme.isDark ? '白色' : '暗色'}
          </Button>
        </div>
      </HeaderNav>
    </Container>
  );
};

export default Header;
