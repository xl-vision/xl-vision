import { oneOf } from '@xl-vision/utils';
import { Middleware, OverflowOptions, Side } from '../types';
import computeOverflowRect from '../utils/computeOverflowRect';

export type ShiftOptions = OverflowOptions & {
  main
};

export default ({ boundary, rootBoundary, padding }: ShiftOptions = {}): Middleware => {
  return {
    name: 'shift',
    fn(ctx) {
      const { x, y, side } = ctx;

      const isVertical = oneOf(['top', 'bottom'], side);

      const overflowRect = computeOverflowRect({
        boundary,
        rootBoundary,
        padding,
        ctx,
      });

      const sides: Array<Side> = isVertical ? ['left', 'right'] : ['top', 'bottom'];

      const pos = { x, y };

      const key = isVertical ? 'x' : 'y';

      for (let i = 0; i < sides.length; i++) {
        const s = sides[i];
        const value = overflowRect[s];
        if (value > 0) {
          pos[key] += i % 2 ? -value : value;
          break;
        }
      }

      return pos;
    },
  };
};
