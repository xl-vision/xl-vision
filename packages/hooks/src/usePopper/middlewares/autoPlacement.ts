import { oneOf } from '@xl-vision/utils';
import { Middleware, OverflowOptions, Side } from '../types';
import computeOverflowRect from '../utils/computeOverflowRect';

export type AutoPlacementOptions = OverflowOptions & {};

export default ({ boundary, rootBoundary, padding }: AutoPlacementOptions = {}): Middleware => {
  return {
    name: 'autoPlacement',
    fn(ctx) {
      const overflowRect = computeOverflowRect({
        boundary,
        rootBoundary,
        padding,
        ctx,
      });

      if (
        Object.keys(overflowRect)
          .map((key) => overflowRect[key as keyof typeof overflowRect])
          .every((value) => value <= 0)
      ) {
        return;
      }

      const { side, extra } = ctx;

      let overflowData = extra.autoPlacement;

      if (!overflowData) {
        const sides = getNextSides(side);
        const index = 0;
        overflowData = {
          sides,
          index,
        };
      }

      const { sides } = overflowData;

      const { index } = overflowData;

      const nextSide = sides[index];

      if (!nextSide) {
        return;
      }

      return {
        side: nextSide,
        data: {
          sides,
          index: index + 1,
        },
        reset: true,
      };
    },
  };
};

const sideMap: Record<Side, Side> = {
  left: 'right',
  right: 'left',
  top: 'bottom',
  bottom: 'top',
};

const getNextSides = (side: Side) => {
  const sides: Array<Side> = [];

  sides.push(sideMap[side]);

  if (oneOf(['top', 'bottom'], side)) {
    sides.push('left');
    sides.push('right');
  } else {
    sides.push('top');
    sides.push('bottom');
  }

  sides.push(side);

  return sides;
};
