import getOffsetParentRect from './getOffsetParentRect';
import { Reference } from './types';

export type RelativeRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export default (reference: Reference, popper: Element): RelativeRect => {
  const { parent: offsetParent, left, top } = getOffsetParentRect(popper);

  const offsetRect = offsetParent.getBoundingClientRect();
  const referenceRect = reference.getBoundingClientRect();

  return {
    x: referenceRect.x - (offsetRect.x + left),
    y: referenceRect.y - (offsetRect.y + top),
    width: referenceRect.width,
    height: referenceRect.height,
  };
};
