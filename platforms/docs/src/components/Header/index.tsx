import React from 'react';
import { styled } from '@xl-vision/react';
import { ThemeContext } from '../ThemeProvider';

const Wrapper = styled('div')(
  ({ theme }) => `
  height: 60px;
  border-bottom: 1px solid ${theme.color.divider};
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0 16px;
`,
);

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
    <Wrapper>
      <Logo>XL-VISION</Logo>
      <button onClick={handleTheme} type='button'>
        {theme.isDark ? '白色' : '暗色'}
      </button>
    </Wrapper>
  );
};

export default Header;
