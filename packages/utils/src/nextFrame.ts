import raf from './raf';

const nextFrame = (fn: () => void) => {
  let cancel = raf(() => {
    cancel = raf(fn);
  });

  const doCancel = () => {
    cancel();
  };

  return doCancel;
};
export default nextFrame;
