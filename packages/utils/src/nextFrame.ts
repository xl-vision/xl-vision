import raf from './raf';

export default (fn: () => void) => {
  let cancel = raf(() => {
    cancel = raf(fn);
  });

  const doCancel = () => {
    cancel();
  };

  return doCancel;
};
