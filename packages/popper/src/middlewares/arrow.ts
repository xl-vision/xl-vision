import { Middleware } from '../types';

export default (): Middleware => {
  return {
    name: 'arrow',
    fn({ x, y, side, referenceRect, popperRect }) {
      const offsetX = -x;
      const offsetY = -y;

      const x1 = Math.min(Math.max(offsetX, 0), popperRect.width);
      const x2 = Math.max(Math.min(popperRect.width, offsetX + referenceRect.width), 0);

      const y1 = Math.min(Math.max(offsetY, 0), popperRect.width);
      const y2 = Math.max(Math.min(popperRect.height, offsetY + referenceRect.height), 0);

      const midX = (x1 + x2) / 2;

      const midY = (y1 + y2) / 2;

      if (side === 'top' || side === 'bottom') {
        return {
          data: {
            x: midX,
          },
        };
      }

      return {
        data: {
          y: midY,
        },
      };
    },
  };
};
