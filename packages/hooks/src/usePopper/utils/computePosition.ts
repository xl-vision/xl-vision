import { getBoundingClientRect, isProduction } from '@xl-vision/utils';
import getOffsetParentRect from './getOffsetParentRect';
import {
  Middleware,
  MiddlewareData,
  MiddlewareParameter,
  Mode,
  Placement,
  VirtualElement,
} from '../types';
import computeCoordsFromPlacement from './computeCoordsFromPlacement';

export type Options = {
  popper: Element;
  reference: Element | VirtualElement;
  placement: Placement;
  middlewares: Array<Middleware>;
  mode: Mode;
};

export default ({ popper, reference, placement, middlewares, mode }: Options) => {
  const { parent: offsetParent, left, top } = getOffsetParentRect(popper);

  const offsetRect = getBoundingClientRect(offsetParent);
  const referenceRect = reference.getBoundingClientRect();
  const popperRect = getBoundingClientRect(popper);

  const offsetX = referenceRect.x - (offsetRect.x + left);
  const offsetY = referenceRect.y - (offsetRect.y + top);

  const { x, y } = computeCoordsFromPlacement({
    placement,
    referenceRect,
    popperRect,
  });

  let middlewareData: MiddlewareData = {
    placement,
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
      initialPlacement: placement,
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
          placement: middlewareData.placement,
          referenceRect,
          popperRect,
        });

        middlewareData.x = newX;
        middlewareData.y = newY;
        i--;
      }
    }
  }

  return {
    x: offsetX + middlewareData.x,
    y: offsetY + middlewareData.y,
    placement: middlewareData.placement,
  };
};
