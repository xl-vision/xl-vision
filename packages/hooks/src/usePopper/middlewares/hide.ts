import { Middleware, OverflowOptions } from '../types';
import computeOverflowRect from '../utils/computeOverflowRect';

export type AutoPlacementOptions = OverflowOptions & {};

export default ({ boundary, rootBoundary, padding }: AutoPlacementOptions = {}): Middleware => {
  return {
    name: 'hide',
    fn(ctx) {
      const { extra, referenceRect } = ctx;

      const overflowRect =
        extra.overflowRect ||
        computeOverflowRect({
          boundary,
          rootBoundary,
          padding,
          ctx,
        });

      const { width, height } = referenceRect;

      return {
        extra: {
          overflowRect,
          hide: {
            referenceHidden:
              width <= overflowRect.left ||
              width <= overflowRect.right ||
              height < overflowRect.top ||
              height < overflowRect.bottom,
          },
        },
      };
    },
  };
};
