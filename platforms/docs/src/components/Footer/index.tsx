import { styled } from '@xl-vision/react';
import React from 'react';

const Wrapper = styled('footer')(() => {
  return {
    padding: '16px 0',
    textAlign: 'center',
  };
});

const Footer: React.FunctionComponent<React.HTMLAttributes<HTMLElement>> = (props) => {
  return (
    <Wrapper {...props}>
      <span>Copyright © 2020-2021 Rhys Xia</span>
    </Wrapper>
  );
};

export default Footer;
