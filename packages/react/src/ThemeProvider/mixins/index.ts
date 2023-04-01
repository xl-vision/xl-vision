import { CSSObject } from '@xl-vision/styled-engine';
import { ThemeWithoutMixins } from '../createTheme';

const createMixins = (theme: ThemeWithoutMixins) => {
  const clearfix: CSSObject = {
    zoom: 1,
    '&:before, &:after': {
      display: 'table',
      boxSizing: 'border-box',
      content: '" "',
    },
    '&:after': {
      clear: 'both',
    },
  };

  const placeholder = (color: string = theme.colors.text.hint) => {
    return {
      '&::-moz-placeholder': {
        opacity: 1,
      },
      '&::placeholder': {
        color,
        userSelect: 'none',
      },
      '&:placeholder-shown': {
        textOverflow: 'ellipsis',
      },
    } as CSSObject;
  };

  return {
    clearfix,
    placeholder,
  };
};

export default createMixins;
