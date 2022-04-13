import { Middleware } from '../types';
import computeOverflowRect from '../utils/computeOverflowRect';

export type Boundary = 'clippingAncestors' | Element | Array<Element>;

export default (): Middleware => {
  return {
    name: 'autoPlacement',
    fn({ popper, referenceRect, placement }) {
      const rect = computeOverflowRect({
        boundary: 'clippingAncestors',
        rootBoundary: 'viewport',
        element: popper,
        referenceRect,
        padding: 0,
      });
    },
  };
};
