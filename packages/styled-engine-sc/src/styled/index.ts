import { Styled } from '@xl-vision/styled-engine-types';
import scStyled from 'styled-components';

const styled: Styled = (tag, options) => {
  if (options) {
    const { shouldForwardProp, label } = options;
    return scStyled(tag).withConfig({
      shouldForwardProp,
      displayName: label,
    }) as ReturnType<Styled>;
  }
  return scStyled(tag) as ReturnType<Styled>;
};

export default styled;
