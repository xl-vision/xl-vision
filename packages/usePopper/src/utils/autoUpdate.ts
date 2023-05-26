import { getBoundingClientRect, isElement, off, on, raf } from '@xl-vision/utils';
import ROP from 'resize-observer-polyfill';
import getOverflowAncestors from './getOverflowAncestors';
import { Reference } from '../types';

export type AutoUpdateOptions = {
  ancestorScroll?: boolean;
  ancestorResize?: boolean;
  elementResize?: boolean;
  animationFrame?: boolean;
};

const autoUpdate = (
  reference: Reference,
  popper: Element,
  update: () => void,
  options: AutoUpdateOptions = {},
) => {
  const {
    ancestorResize: _ancestorResize = true,
    ancestorScroll: _ancestorScroll = true,
    elementResize: _elementResize = true,
    animationFrame = false,
  } = options;

  console.log(options, '111')

  const ancestorResize = _ancestorResize && !animationFrame;
  const ancestorScroll = _ancestorScroll && !animationFrame;
  const elementResize = _elementResize && !animationFrame;

  const ancestors =
    ancestorScroll || ancestorResize
      ? [
          ...(isElement(reference) ? getOverflowAncestors(reference) : []),
          ...getOverflowAncestors(popper),
        ]
      : [];

      console.log(ancestors, '22')

  if (ancestorScroll) {
    ancestors.forEach((ancestor) => {
      // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#improving_scrolling_performance_with_passive_listeners
      on(ancestor as HTMLElement, 'scroll', update, { passive: true });
    });
    on(window, 'scroll', update, { passive: true });
  }

  if (ancestorResize) {
    ancestors.forEach((ancestor) => {
      on(ancestor as HTMLElement, 'resize', update, { passive: true });
    });
    on(window, 'resize', update, { passive: true });
  }

  let observer: ResizeObserver | undefined;

  if (elementResize) {
    let initialUpdate = true;
    observer = new ROP(() => {
      if (!initialUpdate) {
        update();
      }

      initialUpdate = false;
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isElement(reference) && observer.observe(reference);

    observer.observe(popper);
  }

  let cancelFrame: () => void;

  if (animationFrame) {
    let prevReferenceRect = isElement(reference)
      ? getBoundingClientRect(reference)
      : reference.getBoundingClientRect();

    let prevPopperRect = getBoundingClientRect(popper);

    const frameLoop = () => {
      const nextReferenceRect = isElement(reference)
        ? getBoundingClientRect(reference)
        : reference.getBoundingClientRect();

      const nextPopperRect = getBoundingClientRect(popper);

      if (
        prevReferenceRect.x !== nextReferenceRect.x ||
        prevReferenceRect.y !== nextReferenceRect.y ||
        prevReferenceRect.width !== nextReferenceRect.width ||
        prevReferenceRect.height !== nextReferenceRect.height ||
        prevPopperRect.x !== nextPopperRect.x ||
        prevPopperRect.y !== nextPopperRect.y ||
        prevPopperRect.width !== nextPopperRect.width ||
        prevPopperRect.height !== nextPopperRect.height
      ) {
        update();
      }

      prevReferenceRect = nextReferenceRect;
      prevPopperRect = nextPopperRect;

      cancelFrame = raf(frameLoop);
    };

    frameLoop();
  }

  return () => {
    if (ancestorScroll) {
      ancestors.forEach((ancestor) => {
        off(ancestor as HTMLElement, 'scroll', update);
      });
      off(window, 'scroll', update);
    }

    if (ancestorResize) {
      ancestors.forEach((ancestor) => {
        off(ancestor as HTMLElement, 'resize', update);
      });
      off(window, 'resize', update);
    }

    observer?.disconnect();
    observer = undefined;

    cancelFrame?.();
  };
};

export default autoUpdate;
