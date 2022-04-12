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
import { isHTMLElement } from '@xl-vision/utils';

export type Options = {
  popper: Element;
  reference: Reference;
  placement: Placement;
  middlewares: Array<Middleware>;
  mode: Mode;
};

export default ({ popper, reference, placement, middlewares, mode }: Options) => {
  const { parent: offsetParent, left, top } = getOffsetParentRect(popper);

  const offsetRect = offsetParent.getBoundingClientRect();
  const referenceRect = reference.getBoundingClientRect();
  const popperRect = popper.getBoundingClientRect();

  let scaleX = 1;
  let scaleY = 1;

  if (isHTMLElement(popper)) {
    scaleX = popperRect.width / (popper.offsetWidth || 1);
    scaleY = popperRect.height / (popper.offsetHeight || 1);
  }

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

  middlewares.forEach((middleware) => {
    const middlewareParameter: MiddlewareParameter = {
      ...data,
      referenceRect,
      popperRect,
      initialPlacement: placement,
      mode,
      reference,
      popper,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
      }
    }
  });

  return {
    x: offsetX + data.x,
    y: offsetY + data.y,
    placement: data.placement,
  };
};
