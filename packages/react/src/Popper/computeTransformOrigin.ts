import { ModifierArguments, Options } from '@popperjs/core';

const computeTransformOrigin = ({ state }: ModifierArguments<Options>) => {
  const { modifiersData, placement, rects } = state;

  const { popperOffsets } = modifiersData;

  const [basePlacement] = placement.split('-');

  const isVertical = ['left', 'right'].indexOf(basePlacement) > -1;

  const axis = ['top', 'bottom'].indexOf(basePlacement) >= 0 ? 'x' : 'y';
  const len = isVertical ? 'height' : 'width';

  const referenceStart = rects.reference[axis] - popperOffsets![axis];
  const referenceEnd = rects.reference[len] + rects.reference[axis] - popperOffsets![axis];

  const referenceCenter = (referenceStart + referenceEnd) / 2;

  const maxStart = Math.max(referenceStart, 0);
  const maxEnd = Math.min(referenceEnd, rects.popper[len]);

  let center = referenceCenter;

  if (maxStart > referenceCenter || maxEnd < referenceCenter) {
    center = (maxStart + maxEnd) / 2;
  }

  center = Math.round(center);

  const other = ['left', 'top'].indexOf(basePlacement) > -1 ? '100%' : '0%';

  if (isVertical) {
    return `${other} ${center}px`;
  }
  return `${center}px ${other}`;
};

export default computeTransformOrigin;
