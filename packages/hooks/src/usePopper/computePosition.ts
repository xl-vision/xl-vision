import getOffsetParentRect from './getOffsetParentRect';
import {
  Middleware,
  MiddlewareData,
  MiddlewareParameter,
  Mode,
  Placement,
  Reference,
} from './types';

export type Options = {
  popper: Element;
  reference: Reference;
  placement: Placement;
  middlewares: Array<Middleware<any>>;
  mode: Mode;
};

export default ({ popper, reference, placement, middlewares, mode }: Options) => {
  const { parent: offsetParent, left, top } = getOffsetParentRect(popper);

  const offsetRect = offsetParent.getBoundingClientRect();
  const referenceRect = reference.getBoundingClientRect();
  const popperRect = popper.getBoundingClientRect();

  const offsetX = referenceRect.x - (offsetRect.x + left);
  const offsetY = referenceRect.y - (offsetRect.y + top);

  const sortedMiddlewares = middlewares.sort((item1, item2) => item1.order - item2.order);

  let data: MiddlewareData = {
    x: 0,
    y: 0,
    placement,
    extra: {},
  };

  sortedMiddlewares.forEach((middleware) => {
    const middlewareParameter: MiddlewareParameter = {
      ...data,
      initialPlacement: placement,
      mode,
      reference,
      popper,
      referenceRect,
      popperRect,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { fn, options } = middleware;
    const result = fn(middlewareParameter, options);

    if (result) {
      data = { ...data, ...result };
    }
  });

  return {
    x: offsetX + data.x,
    y: offsetY + data.y,
    placement: data.placement,
  };
};
