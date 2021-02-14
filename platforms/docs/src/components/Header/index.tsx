import React from 'react';
import { styled } from '@xl-vision/react';

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
  return (
    <Wrapper>
      <Logo>XL-VISION</Logo>
    </Wrapper>
  );
};

export default Header;
