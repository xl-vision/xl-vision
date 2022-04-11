import { oneOf } from '@xl-vision/utils';
import { Middleware } from '../types';

const base: Middleware = {
  name: 'base',
  order: 0,
  fn({ x, y, referenceRect, popperRect, placement }) {
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
          x,
          y,
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
  },
};

export default base;
