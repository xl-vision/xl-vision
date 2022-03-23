export type DOMVerticalDistance = {
  top: number;
  bottom: number;
};

export const getTargetRect = (target: Window | HTMLElement): DOMVerticalDistance => {
  if (target instanceof Window) {
    return {
      top: 0,
      bottom: window.innerHeight,
    };
  }

  return target.getBoundingClientRect();
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
];

export const addTargetObserver = (target: Window | HTMLElement, fn: () => void) => {
  TRIGGER_EVENTS.forEach((name) => {
    target.addEventListener(name, fn);
  });
};

export const removeTargetObserver = (target: Window | HTMLElement, fn: () => void) => {
  TRIGGER_EVENTS.forEach((name) => {
    target.removeEventListener(name, fn);
  });
};
