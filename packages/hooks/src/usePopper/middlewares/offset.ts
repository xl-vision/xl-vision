import { Middleware } from '../types';

export type OffsetAxes = {
  mainAxis?: number;
  crossAxis?: number;
};

export type OffsetOptions = number | OffsetAxes;

export default (offset: OffsetOptions): Middleware => {
  let mainAxis = 0;
  let crossAxis = 0;

  if (typeof offset === 'number') {
    mainAxis = offset;
  } else {
    mainAxis = offset.mainAxis || 0;
    crossAxis = offset.crossAxis || 0;
  }

  return {
    name: 'offset',
    fn({ x, y, side }) {
      switch (side) {
        case 'top': {
          y -= mainAxis;
          x -= crossAxis;
          break;
        }
        case 'bottom': {
          y += mainAxis;
          x += crossAxis;
          break;
        }
        case 'left': {
          x -= mainAxis;
          y -= crossAxis;
          break;
        }
        case 'right': {
          x += mainAxis;
          y += crossAxis;
          break;
        }
        default:
      }

      return {
        x,
        y,
      };
    },
  };
};
