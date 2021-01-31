import { Styled } from '@xl-vision/styled-engine-types';
import scStyled from 'styled-components';

const styled: Styled = (tag, options) => {
  if (options) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return scStyled(tag).withConfig(options) as any;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return scStyled(tag) as any;
};

export default styled;
