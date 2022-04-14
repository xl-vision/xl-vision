import { oneOf } from '@xl-vision/utils';
import { Middleware, Placement } from '../types';
import computeOverflowRect from '../utils/computeOverflowRect';

export type Boundary = 'clippingAncestors' | Element | Array<Element>;

export default (): Middleware => {
  return {
    name: 'autoPlacement',
    fn(ctx) {
      const overflowRect = computeOverflowRect({
        boundary: 'clippingAncestors',
        rootBoundary: 'viewport',
        padding: 0,
        ctx,
      });

      if (
        Object.keys(overflowRect)
          .map((key) => overflowRect[key as keyof typeof overflowRect])
          .every((value) => value < 0)
      ) {
        return;
      }

      const { placement, extra } = ctx;

      let overflowData = extra.autoPlacement;

      if (!overflowData) {
        const placements = getNextPlacements(placement);
        const index = 0;
        overflowData = {
          placements,
          index,
        };
      }

      const placements = overflowData.placements as Array<Placement>;

      const index = overflowData.index as number;

      const nextPlacement = placements[index];

      if (!nextPlacement) {
        return;
      }

      return {
        placement: nextPlacement,
        data: {
          placements,
          index: index + 1,
        },
        reset: true,
      };
    },
  };
};

const directionMap: Record<string, string> = {
  left: 'right',
  right: 'left',
  top: 'bottom',
  bottom: 'top',
};

const getNextPlacements = (placement: Placement) => {
  const [direction, side] = placement.split('-');
  const placements: Array<string> = [];

  placements.push(genPlacement(directionMap[direction], side));

  if (oneOf(['top', 'bottom'], direction)) {
    placements.push(genPlacement('left', side));
    placements.push(genPlacement('right', side));
  } else {
    placements.push(genPlacement('top', side));
    placements.push(genPlacement('bottom', side));
  }

  placements.push(placement);

  return placements as Array<Placement>;
};

const genPlacement = (direcition: string, side?: string): Placement => {
  return `${direcition}${side ? `-${side}` : ''}` as Placement;
};
