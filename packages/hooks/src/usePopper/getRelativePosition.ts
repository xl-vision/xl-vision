import { getOffsetParent, isHTMLElement } from '@xl-vision/utils';
import { Reference } from './types';

export default (reference: Reference, popper: Element) => {
  const referenceRect = reference.getBoundingClientRect();
  const offsetParent = getOffsetParent(popper);

  let offsetX = 0;
  let offsetY = 0;

  const isOffsetParentAnElement = isHTMLElement(offsetParent);

  if (isOffsetParentAnElement) {
    const offsetRect = offsetParent.getBoundingClientRect();
    offsetX = offsetRect.x + offsetParent.clientLeft;
    offsetY = offsetRect.y + offsetParent.clientTop;
  }

  return {
    x: referenceRect.x - offsetX,
    y: referenceRect.y - offsetY,
    width: referenceRect.width,
    height: referenceRect.height,
  };
};
