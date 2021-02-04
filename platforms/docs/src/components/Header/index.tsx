import React from 'react';
import { styled } from '@xl-vision/react';

const Wrapper = styled('div')`
  height: 60px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  margin: 0 16px;
`;

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
