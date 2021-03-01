import { styled } from '@xl-vision/react';
import React from 'react';

const Wrapper = styled('footer')(({ theme }) => {
  return {
    padding: '10px 0',
    borderTop: `1px solid ${theme.color.divider}`,
    textAlign: 'center',
  };
});

const Footer = () => {
  return (
    <Wrapper>
      <span>Copyright © 2020-2021 Rhys Xia</span>
    </Wrapper>
  );
};

export default Footer;
