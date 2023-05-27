import { act, render, screen } from '@testing-library/react';
import { FC } from 'react';
import useTransition from '..';
import { awaitPromise } from 'test/utils';

describe('useTransition', () => {
  it('Test how to call lifecycle function', async () => {
    const fn = jest.fn();

    const Demo: FC<{ in: boolean }> = ({ in: inProp }) => {
      const { nodeRef } = useTransition({
        in: inProp,
        onEnter(el, isFirst) {
          fn(el, 'onEnter', isFirst);
        },
        onEntering(el, done, isFirst, isCancelled) {
          fn(el, 'onEntering', isFirst, isCancelled());
          done();
        },
        onEntered(el, isFirst) {
          fn(el, 'onEntered', isFirst);
        },
        onExit(el, isFirst) {
          fn(el, 'onExit', isFirst);
        },
        onExiting(el, done, isFirst, isCancelled) {
          fn(el, 'onExiting', isFirst, isCancelled());
          done();
        },
        onExited(el, isFirst) {
          fn(el, 'onExited', isFirst);
        },
      });

      return <div data-testid='demo' ref={nodeRef} />;
    };

    const { rerender } = render(<Demo in={false} />);

    await awaitPromise();

    const el = screen.getByTestId('demo');

    expect(fn.mock.calls.length).toEqual(0);

    rerender(<Demo in={true} />);

    await awaitPromise();

    expect(fn.mock.calls.length).toEqual(3);
    expect(fn.mock.calls[0]).toEqual([el, 'onEnter', false]);
    expect(fn.mock.calls[1]).toEqual([el, 'onEntering', false, false]);
    expect(fn.mock.calls[2]).toEqual([el, 'onEntered', false]);

    fn.mockClear();

    rerender(<Demo in={false} />);

    await awaitPromise();

    expect(fn.mock.calls.length).toEqual(3);
    expect(fn.mock.calls[0]).toEqual([el, 'onExit', false]);
    expect(fn.mock.calls[1]).toEqual([el, 'onExiting', false, false]);
    expect(fn.mock.calls[2]).toEqual([el, 'onExited', false]);
  });

  it('Test transition on first when in transition', async () => {
    const fn = jest.fn();

    const Demo: FC<{ in: boolean }> = ({ in: inProp }) => {
      const { nodeRef } = useTransition({
        in: inProp,
        transitionOnFirst: true,
        onEnter(el, isFirst) {
          fn(el, 'onEnter', isFirst);
        },
        onEntering(el, done, isFirst, isCancelled) {
          fn(el, 'onEntering', isFirst, isCancelled());
          done();
        },
        onEntered(el, isFirst) {
          fn(el, 'onEntered', isFirst);
        },
        onExit(el, isFirst) {
          fn(el, 'onExit', isFirst);
        },
        onExiting(el, done, isFirst, isCancelled) {
          fn(el, 'onExiting', isFirst, isCancelled());
          done();
        },
        onExited(el, isFirst) {
          fn(el, 'onExited', isFirst);
        },
      });

      return <div data-testid='demo' ref={nodeRef} />;
    };

    const { rerender } = render(<Demo in={true} />);

    await awaitPromise();

    const el = screen.getByTestId('demo');

    expect(fn.mock.calls.length).toEqual(3);
    expect(fn.mock.calls[0]).toEqual([el, 'onEnter', true]);
    expect(fn.mock.calls[1]).toEqual([el, 'onEntering', true, false]);
    expect(fn.mock.calls[2]).toEqual([el, 'onEntered', true]);

    fn.mockClear();

    rerender(<Demo in={false} />);

    await awaitPromise();

    expect(fn.mock.calls.length).toEqual(3);
    expect(fn.mock.calls[0]).toEqual([el, 'onExit', false]);
    expect(fn.mock.calls[1]).toEqual([el, 'onExiting', false, false]);
    expect(fn.mock.calls[2]).toEqual([el, 'onExited', false]);
  });

  it('Test transition on first when out transition', async () => {
    const fn = jest.fn();

    const Demo: FC<{ in: boolean }> = ({ in: inProp }) => {
      const { nodeRef } = useTransition({
        in: inProp,
        transitionOnFirst: true,
        onEnter(el, isFirst) {
          fn(el, 'onEnter', isFirst);
        },
        onEntering(el, done, isFirst, isCancelled) {
          fn(el, 'onEntering', isFirst, isCancelled());
          done();
        },
        onEntered(el, isFirst) {
          fn(el, 'onEntered', isFirst);
        },
        onExit(el, isFirst) {
          fn(el, 'onExit', isFirst);
        },
        onExiting(el, done, isFirst, isCancelled) {
          fn(el, 'onExiting', isFirst, isCancelled());
          done();
        },
        onExited(el, isFirst) {
          fn(el, 'onExited', isFirst);
        },
      });

      return <div data-testid='demo' ref={nodeRef} />;
    };

    const { rerender } = render(<Demo in={false} />);

    await awaitPromise();

    const el = screen.getByTestId('demo');

    expect(fn.mock.calls.length).toEqual(3);
    expect(fn.mock.calls[0]).toEqual([el, 'onExit', true]);
    expect(fn.mock.calls[1]).toEqual([el, 'onExiting', true, false]);
    expect(fn.mock.calls[2]).toEqual([el, 'onExited', true]);

    fn.mockClear();

    rerender(<Demo in={true} />);

    await awaitPromise();

    expect(fn.mock.calls.length).toEqual(3);
    expect(fn.mock.calls[0]).toEqual([el, 'onEnter', false]);
    expect(fn.mock.calls[1]).toEqual([el, 'onEntering', false, false]);
    expect(fn.mock.calls[2]).toEqual([el, 'onEntered', false]);
  });

  it('Test transition is cancelled', async () => {
    const fn = jest.fn();

    const isCancelledFn = jest.fn<void, Array<() => boolean>>();

    const Demo: FC<{ in: boolean }> = ({ in: inProp }) => {
      const { nodeRef } = useTransition({
        in: inProp,
        onEnter(el, isFirst) {
          fn(el, 'onEnter', isFirst);
        },
        onEntering(el, _, isFirst, isCancelled) {
          isCancelledFn(isCancelled);
          fn(el, 'onEntering', isFirst);
        },
        onEntered(el, isFirst) {
          fn(el, 'onEntered', isFirst);
        },
        onEnterCancelled(el, isFirst) {
          fn(el, 'onEnterCancelled', isFirst);
        },
        onExit(el, isFirst) {
          fn(el, 'onExit', isFirst);
        },
        onExiting(el, _, isFirst, isCancelled) {
          isCancelledFn(isCancelled);
          fn(el, 'onExiting', isFirst);
        },
        onExited(el, isFirst) {
          fn(el, 'onExited', isFirst);
        },
        onExitCancelled(el, isFirst) {
          fn(el, 'onExitCancelled', isFirst);
        },
      });

      return <div data-testid='demo' ref={nodeRef} />;
    };

    const { rerender } = render(<Demo in={false} />);

    const el = screen.getByTestId('demo');

    expect(fn.mock.calls.length).toEqual(0);

    rerender(<Demo in={true} />);

    await awaitPromise();

    expect(fn.mock.calls.length).toEqual(2);
    expect(fn.mock.calls[0]).toEqual([el, 'onEnter', false]);
    expect(fn.mock.calls[1]).toEqual([el, 'onEntering', false]);

    expect(isCancelledFn.mock.calls.length).toBe(1);
    expect(isCancelledFn.mock.calls[0][0]()).toBe(false);

    fn.mockClear();

    rerender(<Demo in={false} />);

    await awaitPromise();

    expect(fn.mock.calls.length).toEqual(3);
    expect(fn.mock.calls[0]).toEqual([el, 'onEnterCancelled', false]);
    expect(fn.mock.calls[1]).toEqual([el, 'onExit', false]);
    expect(fn.mock.calls[2]).toEqual([el, 'onExiting', false]);

    expect(isCancelledFn.mock.calls.length).toBe(2);
    expect(isCancelledFn.mock.calls[0][0]()).toBe(true);
    expect(isCancelledFn.mock.calls[1][0]()).toBe(false);

    fn.mockClear();

    rerender(<Demo in={true} />);
    await awaitPromise();

    expect(fn.mock.calls.length).toEqual(3);
    expect(fn.mock.calls[0]).toEqual([el, 'onExitCancelled', false]);
    expect(fn.mock.calls[1]).toEqual([el, 'onEnter', false]);
    expect(fn.mock.calls[2]).toEqual([el, 'onEntering', false]);

    expect(isCancelledFn.mock.calls.length).toBe(3);
    expect(isCancelledFn.mock.calls[0][0]()).toBe(true);
    expect(isCancelledFn.mock.calls[1][0]()).toBe(true);
    expect(isCancelledFn.mock.calls[2][0]()).toBe(false);
  });

  it("test 'show' value", async () => {
    const fn = jest.fn<void, Array<() => void>>();

    const Demo: FC<{ in: boolean }> = ({ in: inProp }) => {
      const { nodeRef, show } = useTransition({
        in: inProp,
        onExiting(_, done) {
          fn(done);
        },
      });

      return <div data-show={show} data-testid='demo' ref={nodeRef} />;
    };

    const { rerender } = render(<Demo in={false} />);

    const el = screen.getByTestId('demo');

    expect(el.dataset.show).toEqual('false');

    rerender(<Demo in={true} />);

    expect(el.dataset.show).toEqual('true');

    rerender(<Demo in={false} />);

    expect(el.dataset.show).toEqual('true');

    await awaitPromise();

    act(() => {
      fn.mock.calls[0][0]();
    });

    expect(el.dataset.show).toEqual('false');
  });
});
