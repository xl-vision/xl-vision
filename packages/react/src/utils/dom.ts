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

export const forceReflow = () => {
  if (env.isBrowser) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    document.body.scrollHeight;
  }
};
