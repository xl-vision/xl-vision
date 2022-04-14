import { Middleware } from '../types';

export default (offset: number): Middleware => {
  return {
    name: 'offset',
    fn({ x, y, side }) {
      switch (side) {
        case 'top': {
          y -= offset;
          break;
        }
        case 'bottom': {
          y += offset;
          break;
        }
        case 'left': {
          x -= offset;
          break;
        }
        case 'right': {
          x += offset;
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
