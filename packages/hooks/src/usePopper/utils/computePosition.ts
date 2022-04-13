import { getBoundingClientRect, isProduction } from '@xl-vision/utils';
import getOffsetParentRect from './getOffsetParentRect';
import {
  Middleware,
  MiddlewareData,
  MiddlewareParameter,
  Mode,
  Placement,
  Reference,
} from '../types';
import computeCoordsFromPlacement from './computeCoordsFromPlacement';

export type Options = {
  popper: Element;
  reference: Reference;
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

  let data: MiddlewareData = {
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
      ...data,
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
      const { data: middlewareData, reset, ...others } = result;
      const { extra, ...otherData } = data;

      data = {
        ...otherData,
        ...others,
        extra: {
          ...extra,
          [name]: {
            ...(extra[name] || {}),
            ...(middlewareData || {}),
          },
        },
      };

      if (reset) {
        const { x: newX, y: newY } = computeCoordsFromPlacement({
          placement: data.placement,
          referenceRect,
          popperRect,
        });

        data.x = newX;
        data.y = newY;
        i--;
      }
    }
  }

  return {
    x: offsetX + data.x,
    y: offsetY + data.y,
    placement: data.placement,
  };
};
