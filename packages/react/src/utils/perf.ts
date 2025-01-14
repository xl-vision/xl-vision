import { raf } from '@xl-vision/utils';

// eslint-disable-next-line import-x/prefer-default-export
export const throttleByAnimationFrame = <Fn extends (...args: Array<unknown>) => unknown>(
  fn: Fn,
) => {
  let cancel: (() => void) | undefined;

  let ret: ReturnType<Fn> | undefined;

  const later = (args: Parameters<Fn>) => () => {
    cancel = undefined;
    ret = fn(...args) as ReturnType<Fn>;
  };

  const throttle = (...args: Parameters<Fn>) => {
    if (cancel === undefined) {
      cancel = raf(later(args));
    }
    return ret;
  };

  throttle.cancel = cancel;

  return throttle;
};
