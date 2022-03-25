import { env } from '@xl-vision/utils';

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
