import { getBoundingClientRect, isWindow, off, on, EventMap } from '@xl-vision/utils';

export type DOMVerticalDistance = {
  top: number;
  bottom: number;
};

export const getTargetRect = (target: Window | HTMLElement): DOMVerticalDistance => {
  if (isWindow(target)) {
    return {
      top: 0,
      bottom: target.innerHeight,
    };
  }

  return getBoundingClientRect(target);
};

export function getFixedTop(
  placeholderReact: DOMVerticalDistance,
  targetRect: DOMVerticalDistance,
  offsetTop?: number,
) {
  if (offsetTop !== undefined && targetRect.top > placeholderReact.top - offsetTop) {
    return offsetTop + targetRect.top;
  }
  return undefined;
}

export function getFixedBottom(
  placeholderReact: DOMVerticalDistance,
  targetRect: DOMVerticalDistance,
  offsetBottom?: number,
) {
  if (offsetBottom !== undefined && targetRect.bottom < placeholderReact.bottom + offsetBottom) {
    const targetBottomOffset = window.innerHeight - targetRect.bottom;
    return offsetBottom + targetBottomOffset;
  }
  return undefined;
}

const TRIGGER_EVENTS = [
  'resize',
  'scroll',
  'touchstart',
  'touchmove',
  'touchend',
  'pageshow',
  'load',
] as const;

export const addTargetObserver = (target: Window | HTMLElement, fn: () => void) => {
  TRIGGER_EVENTS.forEach((name) => {
    on(target, name as keyof EventMap<Window | HTMLElement>, fn);
  });
};

export const removeTargetObserver = (target: Window | HTMLElement, fn: () => void) => {
  TRIGGER_EVENTS.forEach((name) => {
    off(target, name as keyof EventMap<Window | HTMLElement>, fn);
  });
};
