import emStyled from '@emotion/styled';
import { Styled } from '@xl-vision/styled-engine-types';

const styled: Styled = (tag, options) => {
  if (options) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return emStyled(tag as any, options) as ReturnType<Styled>;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return emStyled(tag as any) as ReturnType<Styled>;
};

export default styled;
