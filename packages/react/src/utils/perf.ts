import raf from './raf';

// eslint-disable-next-line import/prefer-default-export
export const throttleByAnimationFrame = <Fn extends (...args: Array<any>) => any>(fn: Fn) => {
  let cancel: (() => void) | undefined;

  let ret: ReturnType<Fn> | undefined;

  const later = (args: Parameters<Fn>) => () => {
    cancel = undefined;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    ret = fn(...args);
  };

  const throttle = (...args: Parameters<Fn>) => {
    if (cancel === undefined) {
      cancel = raf(later(args));
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return ret;
  };

  throttle.cancel = cancel;

  return throttle;
};
