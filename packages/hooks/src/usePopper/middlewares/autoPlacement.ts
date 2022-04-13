import { oneOf } from '@xl-vision/utils';
import { Middleware, Placement } from '../types';
import computeOverflowRect from '../utils/computeOverflowRect';

export type Boundary = 'clippingAncestors' | Element | Array<Element>;

export default (): Middleware => {
  return {
    name: 'autoPlacement',
    fn({ popper, popperRect, placement, extra }) {
      let overflowData = extra.autoPlacement;

      if (!overflowData) {
        const placements = getNextPlacements(placement);
        const index = -1;
        overflowData = {
          placements,
          index,
        };
      }

      const placements = overflowData.placements as Array<Placement>;

      const nextIndex = (overflowData.index as number) + 1;

      const nextPlacement = placements[nextIndex];

      if (!nextPlacement) {
        return;
      }

      const overflowRect = computeOverflowRect({
        boundary: 'clippingAncestors',
        rootBoundary: 'viewport',
        padding: 0,
        element: popper,
        elementRect: popperRect,
      });

      if (
        Object.keys(overflowRect)
          .map((key) => overflowRect[key as keyof typeof overflowRect])
          .every((value) => value < 0)
      ) {
        return {
          placement: nextPlacement,
          data: {
            placements,
            index: nextIndex,
          },
          reset: true,
        };
      }
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

  return placements as Array<Placement>;
};

const genPlacement = (direcition: string, side?: string): Placement => {
  return `${direcition}${side ? `-${side}` : ''}` as Placement;
};
