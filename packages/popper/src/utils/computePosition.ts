import { getBoundingClientRect, isHTMLElement, isProduction } from '@xl-vision/utils';
import {
  Alignment,
  Middleware,
  MiddlewareData,
  MiddlewareContext,
  PopperMode,
  Placement,
  PopperData,
  PopperRect,
  Side,
  Reference,
} from '../types';
import computeCoordsFromPlacement from './computeCoordsFromPlacement';
import getOffsetParentRect from './getOffsetParentRect';

export type Options = {
  popper: Element;
  reference: Reference;
  placement: Placement;
  middlewares: Array<Middleware>;
  mode: PopperMode;
};

export default ({ popper, reference, placement, middlewares, mode }: Options): PopperData => {
  if (!isProduction) {
    const names = middlewares.map((it) => it.name);
    if (names.length !== new Set(names).size) {
      throw new Error('[usePopper] middlewares should have unique names');
    }
  }

  const { side, alignment } = splitPlacement(placement);

  const { parent: offsetParent, left, top } = getOffsetParentRect(popper);

  const offsetRect = getBoundingClientRect(offsetParent);
  const referenceRect = reference.getBoundingClientRect();
  const popperRect = getPopperRect(popper);

  const scroll =
    mode === 'fixed'
      ? { top: offsetParent.scrollTop, left: offsetParent.scrollLeft }
      : { top: 0, left: 0 };

  const offsetX = referenceRect.x - (offsetRect.x + left + scroll.left);
  const offsetY = referenceRect.y - (offsetRect.y + top + scroll.top);

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
            '[usePopper] The middleware lifecycle appears to be',
            'running in an infinite loop. This is usually caused by a `reset`',
            'continually being returned without a break condition.',
          ].join(' '),
        );
      }
    }

    const middleware = middlewares[i];

    const middlewareContext: MiddlewareContext = {
      ...middlewareData,
      referenceRect,
      popperRect,
      initialSide: side,
      initialAlignment: alignment,
      mode,
      reference,
      popper,
    };

    const { fn, name } = middleware;
    const result = fn(middlewareContext);

    if (result) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { data, reset, ...others } = result;

      middlewareData = {
        ...middlewareData,
        ...others,
      };

      if (data) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        middlewareData.extra[name] = data;
      }

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
    placement: (actualSide + (actualAlignment ? `-${actualAlignment}` : '')) as Placement,
    extra: middlewareData.extra,
  };
};

const splitPlacement = (placement: Placement) => {
  const [side, alignment] = placement.split('-');

  return {
    side: side as Side,
    alignment: alignment as Alignment | undefined,
  };
};

const getPopperRect = (popper: Element): PopperRect => {
  if (isHTMLElement(popper)) {
    return {
      width: popper.offsetWidth,
      height: popper.offsetHeight,
    };
  }

  const rect = getBoundingClientRect(popper);

  return {
    width: rect.width,
    height: rect.height,
  };
};
