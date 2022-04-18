import { oneOf } from '@xl-vision/utils';
import { Middleware, OverflowOptions, Side } from '../types';
import computeOverflowRect from '../utils/computeOverflowRect';

export type ShiftOptions = OverflowOptions & {
  mainAxis?: boolean;
  crossAxis?: boolean;
};

export default ({
  boundary,
  rootBoundary,
  padding,
  mainAxis = true,
  crossAxis,
}: ShiftOptions = {}): Middleware => {
  return {
    name: 'shift',
    fn(ctx) {
      const { x, y, side, referenceRect, popperRect } = ctx;

      const isVertical = oneOf(['top', 'bottom'], side);

      const overflowRect = computeOverflowRect({
        boundary,
        rootBoundary,
        padding,
        ctx,
      });
      const pos = { x, y };

      if (mainAxis) {
        const sides: Array<Side> = isVertical ? ['left', 'right'] : ['top', 'bottom'];

        const key = isVertical ? 'x' : 'y';

        for (let i = 0; i < sides.length; i++) {
          const s = sides[i];
          const value = overflowRect[s];
          if (value > 0) {
            pos[key] += i % 2 ? -value : value;
            break;
          }
        }
      }

      if (crossAxis) {
        const sides: Array<Side> = isVertical ? ['top', 'bottom'] : ['left', 'right'];

        const key = isVertical ? 'y' : 'x';

        for (let i = 0; i < sides.length; i++) {
          const s = sides[i];
          const value = overflowRect[s];
          if (value > 0) {
            pos[key] += i % 2 ? -value : value;
            break;
          }
        }
      }

      pos.x = Math.min(Math.max(pos.x, -popperRect.width), referenceRect.width);
      pos.y = Math.min(Math.max(pos.y, -popperRect.height), referenceRect.height);

      return pos;
    },
  };
};
