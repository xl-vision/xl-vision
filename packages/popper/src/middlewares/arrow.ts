import { Middleware } from '../types';

export type ArrowOptions = {
  padding?: number | { x: number; y: number };
};

export default ({ padding = 0 }: ArrowOptions = {}): Middleware => {
  const paddingX = typeof padding === 'number' ? padding : padding.x;
  const paddingY = typeof padding === 'number' ? padding : padding.y;

  return {
    name: 'arrow',
    fn({ x, y, side, referenceRect, popperRect }) {
      const offsetX = -x;
      const offsetY = -y;

      const x1 = Math.min(Math.max(offsetX, paddingX), popperRect.width - paddingX);
      const x2 = Math.max(
        Math.min(popperRect.width - paddingX, offsetX + referenceRect.width),
        paddingX,
      );

      const y1 = Math.min(Math.max(offsetY, paddingY), popperRect.height - paddingY);
      const y2 = Math.max(
        Math.min(popperRect.height - paddingY, offsetY + referenceRect.height),
        paddingY,
      );

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
