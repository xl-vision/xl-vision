import deepMerge from '../../utils/function';
import { DeepPartial } from '../../utils/types';

const defaultShape = {
  borderRadius: {
    md: 4,
  },
};

export type FullShape = typeof defaultShape;

export type Shape = DeepPartial<FullShape>;

const createShape = (shape: Shape = {}): FullShape => {
  return deepMerge(defaultShape, shape);
};

export default createShape;
