import { CSSObject } from '@xl-vision/styled-engine';

export type MixinName = 'clearfix';

export type Mixins = {
  [key in MixinName]: CSSObject;
};

const mixins: Mixins = {
  clearfix: {
    zoom: 1,
    '&:before, &:after': {
      display: 'table',
      boxSizing: 'border-box',
      content: '" "',
    },
    '&:after': {
      clear: 'both',
    },
  },
};

export default mixins;
