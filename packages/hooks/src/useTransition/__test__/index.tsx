import useTransition from '..';
import { renderHook } from '../../../../../test/utils';

describe('useTransition', () => {
  it('Test always get last value', () => {
    const fn = jest.fn();

    const { result, rerender } = renderHook(
      (inProp: boolean) =>
        useTransition({
          in: inProp,
          onEnter(_, isFirst) {
            fn('onEnter', isFirst);
          },
          onEntering(_, done, isFirst) {
            fn('onEntering', isFirst);
            done();
          },
          onEntered(_, isFirst) {
            fn('onEntered', isFirst);
          },
          onExit(_, isFirst) {
            fn('onExit', isFirst);
          },
          onExiting(_, done, isFirst) {
            fn('onExiting', isFirst);
            done();
          },
          onExited(_, isFirst) {
            fn('onExited', isFirst);
          },
        }),
      {
        initialProps: false,
      },
    );

    expect(fn.mock.calls.length).toBe(0);
  });
});
