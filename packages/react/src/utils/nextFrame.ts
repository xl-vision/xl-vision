import { raf } from '@xl-vision/utils';

export default (fn: () => void) => {
  let cancel = raf(() => {
    cancel = raf(fn);
  });

  const doCancel = () => {
    cancel();
  };

  return doCancel;
};
