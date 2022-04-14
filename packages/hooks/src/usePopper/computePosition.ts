import { getBoundingClientRect, isProduction } from '@xl-vision/utils';
import getOffsetParentRect from './utils/getOffsetParentRect';
import {
  Alignment,
  Middleware,
  MiddlewareData,
  MiddlewareParameter,
  Mode,
  Placement,
  Side,
  VirtualElement,
} from './types';
import computeCoordsFromPlacement from './utils/computeCoordsFromPlacement';

export type Options = {
  popper: Element;
  reference: Element | VirtualElement;
  placement: Placement;
  middlewares: Array<Middleware>;
  mode: Mode;
};

export default ({ popper, reference, placement, middlewares, mode }: Options) => {
  const { side, alignment } = splitPlacement(placement);

  const { parent: offsetParent, left, top } = getOffsetParentRect(popper);

  const offsetRect = getBoundingClientRect(offsetParent);
  const referenceRect = reference.getBoundingClientRect();
  const popperRect = getBoundingClientRect(popper);

  const offsetX = referenceRect.x - (offsetRect.x + left);
  const offsetY = referenceRect.y - (offsetRect.y + top);

  const { x, y } = computeCoordsFromPlacement({
    side,
    alignment,
    referenceRect,
    popperRect,
  });

  let middlewareData: MiddlewareData = {
    side,
    alignment,
    x,
    y,
    extra: {},
  };

  let debugCount = 0;

  for (let i = 0; i < middlewares.length; i++) {
    if (!isProduction) {
      debugCount++;
      if (debugCount > 100) {
        throw new Error(
          [
            'usePopper: The middleware lifecycle appears to be',
            'running in an infinite loop. This is usually caused by a `reset`',
            'continually being returned without a break condition.',
          ].join(' '),
        );
      }
    }

    const middleware = middlewares[i];

    const middlewareParameter: MiddlewareParameter = {
      ...middlewareData,
      referenceRect,
      popperRect,
      initialSide: side,
      initialAlignment: alignment,
      mode,
      reference,
      popper,
    };

    const { name, fn } = middleware;
    const result = fn(middlewareParameter);

    if (result) {
      const { data, reset, ...others } = result;

      middlewareData = {
        ...middlewareData,
        ...others,
      };

      middlewareData.extra[name] = data || {};

      if (reset) {
        const { x: newX, y: newY } = computeCoordsFromPlacement({
          side: middlewareData.side,
          alignment: middlewareData.alignment,
          referenceRect,
          popperRect,
        });

        middlewareData.x = newX;
        middlewareData.y = newY;
        i--;
      }
    }
  }

  const actualSide = middlewareData.side;
  const actualAlignment = middlewareData.alignment;

  return {
    x: offsetX + middlewareData.x,
    y: offsetY + middlewareData.y,
    side: actualSide,
    alignment: actualAlignment,
    placement: (actualSide + (actualAlignment ? `-${actualAlignment}` : '')) as Placement,
  };
};

const splitPlacement = (placement: Placement) => {
  const [side, alignment] = placement.split('-');

  return {
    side: side as Side,
    alignment: alignment as Alignment | undefined,
  };
};