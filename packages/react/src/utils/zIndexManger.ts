import { isServer } from '@xl-vision/utils';

let zIndex = 1000;

// eslint-disable-next-line import/prefer-default-export
export const increaseZindex = () => {
  if (isServer) {
    return zIndex;
  }
  return zIndex++;
};
