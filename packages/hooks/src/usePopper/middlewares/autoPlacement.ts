import { Middleware } from '../types';

export default (boundary: number): Middleware => {
  return {
    name: 'offset',
    fn({ x, y, referenceRect, popperRect, placement }) {},
  };
};
