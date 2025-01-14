import { isBrowser } from '@xl-vision/utils';

// eslint-disable-next-line import-x/prefer-default-export
export const forceReflow = () => {
  if (isBrowser) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    document.body.scrollHeight;
  }
};
