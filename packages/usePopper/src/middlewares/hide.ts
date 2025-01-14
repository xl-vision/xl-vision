import { Middleware, OverflowOptions } from '../types';
import computeOverflowRect from '../utils/computeOverflowRect';

export type HideOptions = OverflowOptions & {};

const hide = ({ boundary, rootBoundary, padding }: HideOptions = {}): Middleware => {
  return {
    name: 'hide',
    fn(ctx) {
      const { referenceRect } = ctx;

      const overflowRect = computeOverflowRect({
        boundary,
        rootBoundary,
        padding,
        target: 'reference',
        ctx,
      });

      const { width, height } = referenceRect;

      return {
        data: {
          referenceHidden:
            width <= overflowRect.left ||
            width <= overflowRect.right ||
            height < overflowRect.top ||
            height < overflowRect.bottom,
        },
      };
    },
  };
};
export default hide;
