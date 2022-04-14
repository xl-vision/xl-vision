import { deepMerge } from '@xl-vision/utils';
import { DeepPartial } from '../../utils/types';

export type ComponentSize = 'small' | 'middle' | 'large';

export type StyleItem = {
  borderRadius: number;
  border: number;
  padding: { x: number; y: number };
  fontSize: number;
};

export type FullStyleSize = Record<ComponentSize, StyleItem>;

const defaultStyleSize: FullStyleSize = {
  small: {
    borderRadius: 4,
    border: 1,
    padding: { y: 4, x: 10 },
    fontSize: 0.75,
  },
  middle: {
    borderRadius: 4,
    border: 1,
    padding: { y: 6, x: 12 },
    fontSize: 1,
  },
  large: {
    borderRadius: 4,
    border: 1,
    padding: { y: 8, x: 22 },
    fontSize: 1.15,
  },
};

export type StyleSize = DeepPartial<FullStyleSize>;

const createStyleSize = (styleSize: StyleSize = {}): FullStyleSize => {
  return deepMerge(defaultStyleSize, styleSize);
};

export default createStyleSize;
