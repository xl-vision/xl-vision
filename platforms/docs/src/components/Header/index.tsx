import React from 'react';
import { styled } from '@xl-vision/react';
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
    width: '100%',
    zIndex: 1000,
    height: '60px',
    // borderBottom: `1px solid ${theme.color.divider}`,
    display: 'flex',
    alignItems: 'center',
    margin: 0,
    padding: '0 16px',
    background: `${theme.color.background}`,
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
        <button onClick={handleTheme} type='button'>
          {theme.isDark ? '白色' : '暗色'}
        </button>
      </HeaderNav>
    </Container>
  );
};

export default Header;
