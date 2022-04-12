import { Middleware } from '../types';

export type Boundary = 'clippingAncestors' | Element | Array<Element>;

export default (): Middleware => {
  return {
    name: 'autoPlacement',
    fn({ x, y, referenceRect, popperRect, placement }) {},
  };
};
