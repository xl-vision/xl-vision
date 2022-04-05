import { env } from '@xl-vision/utils';
import { noop } from './function';

export default (fn: () => void) => {
  if (env.isServer) {
    fn();
    return noop;
  }
  if (window.requestAnimationFrame) {
    let id: number | undefined = window.requestAnimationFrame(fn);
    return () => {
      if (id) {
        window.cancelAnimationFrame(id);
      }
      id = undefined;
    };
  }
  let id: NodeJS.Timeout | undefined = setTimeout(fn, 16);
  return () => {
    if (id) {
      clearTimeout(id);
    }
    id = undefined;
  };
};
