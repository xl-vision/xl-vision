import { getDocumentElement, isDocument, isServer, isWindow, raf } from '@xl-vision/utils';
import { easeInOutCubic } from './easings';

export const getScroll = (target: HTMLElement | Window | Document | null, top: boolean): number => {
  if (isServer || !target) {
    return 0;
  }
  const method = top ? 'scrollTop' : 'scrollLeft';
  let result = 0;
  if (isWindow(target)) {
    result = target[top ? 'pageYOffset' : 'pageXOffset'];
  } else if (isDocument(target)) {
    result = document.documentElement[method];
  } else if (target) {
    result = target[method];

    if (typeof result !== 'number') {
      result = getDocumentElement(target)[method];
    }
  }
  return result;
};

type ScrollToOptions = {
  /** Scroll container, default as window */
  container?: HTMLElement | Window | Document;
  /** Scroll end callback */
  callback?: () => void;
  /** Animation duration, default as 450 */
  duration?: number;
};

export const scrollTo = (y: number, options: ScrollToOptions = {}) => {
  const { container = window, callback, duration = 450 } = options;
  const scrollTop = getScroll(container, true);
  const startTime = Date.now();

  const frameFunc = () => {
    const currentTime = Date.now();
    const time = currentTime - startTime;

    const nextScrollTop = easeInOutCubic(time > duration ? duration : time, duration, scrollTop, y);
    if (isWindow(container)) {
      container.scrollTo(window.pageXOffset, nextScrollTop);
    } else if (isDocument(container)) {
      container.documentElement.scrollTop = nextScrollTop;
    } else {
      container.scrollTop = nextScrollTop;
    }
    if (time < duration) {
      raf(frameFunc);
    } else if (typeof callback === 'function') {
      callback();
    }
  };
  raf(frameFunc);
};
