import { styled } from '@xl-vision/react';
import { FC, HTMLAttributes } from 'react';

const Wrapper = styled('footer')(() => {
  return {
    padding: '16px 0',
    textAlign: 'center',
  };
});

const Footer: FC<HTMLAttributes<HTMLElement>> = (props) => {
  return (
    <Wrapper {...props}>
      <span>Copyright © 2020-2021 Rhys Xia</span>
    </Wrapper>
  );
};

export default Footer;
