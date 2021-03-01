import React from 'react';
import { Button, styled, Icon } from '@xl-vision/react';
import DarkMode from '@xl-vision/icons/Brightness4Filled';
import LightkMode from '@xl-vision/icons/Brightness7Filled';
import GithubIcon from './GithubIcon';
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

  const { isDark, setDark } = theme;

  const handleTheme = React.useCallback(() => {
    setDark((prev) => !prev);
  }, [setDark]);

  return (
    <Container>
      <HeaderNav>
        <Logo>XL-VISION</Logo>
        <div>
          <Button
            variant='text'
            onClick={handleTheme}
            prefixIcon={<Icon>{isDark ? <LightkMode /> : <DarkMode />}</Icon>}
          />
          <Button
            variant='text'
            target='_black'
            href='https://github.com/xl-vision/xl-vision'
            prefixIcon={
              <Icon>
                <GithubIcon />
              </Icon>
            }
          />
        </div>
      </HeaderNav>
    </Container>
  );
};

export default Header;
