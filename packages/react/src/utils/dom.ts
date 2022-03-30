import { env } from '@xl-vision/utils';
import { easeInOutCubic } from './easings';
import { raf } from './transition';

export const contains = (parent: Element, child: Element | null) => {
  if (parent.contains) {
    return parent.contains(child);
  }
  let temp: Element | null = child;
  while (temp) {
    if (temp === parent) {
      return true;
    }
    temp = temp.parentElement;
  }
  return false;
};

export const isWindow = (obj: any): obj is Window => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return obj !== null && obj !== undefined && obj === obj.window;
};

export const getScroll = (target: HTMLElement | Window | Document | null, top: boolean): number => {
  if (env.isServer || !target) {
    return 0;
  }
  const method = top ? 'scrollTop' : 'scrollLeft';
  let result = 0;
  if (isWindow(target)) {
    result = target[top ? 'pageYOffset' : 'pageXOffset'];
  } else if (target instanceof Document) {
    result = target.documentElement[method];
  } else if (target) {
    result = target[method];

    if (typeof result !== 'number') {
      result = target.ownerDocument.documentElement?.[method];
    }
  }
  return result;
};

type ScrollToOptions = {
  /** Scroll container, default as window */
  container?: HTMLElement | Window | Document;
  /** Scroll end callback */
  callback?: () => any;
  /** Animation duration, default as 450 */
  duration?: number;
};

export const scrollTo = (y: number, options: ScrollToOptions = {}) => {
  const { container = window, callback, duration = 450 } = options;
  const scrollTop = getScroll(container, true);
  const startTime = Date.now();

  const frameFunc = () => {
    const timestamp = Date.now();
    const time = timestamp - startTime;
    const nextScrollTop = easeInOutCubic(time > duration ? duration : time, scrollTop, y, duration);
    if (isWindow(container)) {
      container.scrollTo(window.pageXOffset, nextScrollTop);
    } else if (container instanceof HTMLDocument || container.constructor.name === 'HTMLDocument') {
      (container as HTMLDocument).documentElement.scrollTop = nextScrollTop;
    } else {
      (container as HTMLElement).scrollTop = nextScrollTop;
    }
    if (time < duration) {
      raf(frameFunc);
    } else if (typeof callback === 'function') {
      callback();
    }
  };
  raf(frameFunc);
};
