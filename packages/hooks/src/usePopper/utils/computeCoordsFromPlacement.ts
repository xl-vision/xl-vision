import { oneOf } from '@xl-vision/utils';
import { Placement, Rect } from '../types';

export type Options = {
  placement: Placement;
  referenceRect: Rect;
  popperRect: Rect;
};

export default ({ placement, referenceRect, popperRect }: Options) => {
  const [position, axis] = placement.split('-');

  let coords: { x: number; y: number };

  switch (position) {
    case 'top': {
      coords = {
        x: (referenceRect.width - popperRect.width) / 2,
        y: -popperRect.height,
      };
      break;
    }
    case 'bottom': {
      coords = {
        x: (referenceRect.width - popperRect.width) / 2,
        y: referenceRect.height,
      };
      break;
    }
    case 'left': {
      coords = {
        x: -popperRect.width,
        y: (referenceRect.height - popperRect.height) / 2,
      };
      break;
    }
    case 'right': {
      coords = {
        x: referenceRect.width,
        y: (referenceRect.height - popperRect.height) / 2,
      };
      break;
    }
    default: {
      coords = {
        x: 0,
        y: 0,
      };
    }
  }

  const isVertical = oneOf(['top', 'bottom'], position);

  const mainAxis = isVertical ? 'x' : 'y';

  const direction = isVertical ? 'width' : 'height';

  switch (axis) {
    case 'start': {
      coords[mainAxis] -= (referenceRect[direction] - popperRect[direction]) / 2;
      break;
    }
    case 'end': {
      coords[mainAxis] += (referenceRect[direction] - popperRect[direction]) / 2;
      break;
    }
    default:
  }

  return coords;
};
