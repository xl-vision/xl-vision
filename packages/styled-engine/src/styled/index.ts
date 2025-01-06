import emStyled from '@emotion/styled';
import { Styled } from '@xl-vision/styled-engine-types';

const styled: Styled = (tag, options) => {
  if (options) {
    return emStyled(tag as any, options) as ReturnType<Styled>;
  }
  return emStyled(tag as any) as ReturnType<Styled>;
};

export default styled;
