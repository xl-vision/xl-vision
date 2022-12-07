import { act, render, screen } from '@testing-library/react';
import { FC } from 'react';
import * as utils from '@xl-vision/utils';
import useCssTransition from '..';

const nextFrame = jest.spyOn(utils, 'nextFrame').mockImplementation();
const onTransitionEnd = jest.spyOn(utils, 'onTransitionEnd').mockImplementation();

describe('useCssTransition', () => {
  beforeEach(() => {
    nextFrame.mockClear();
    onTransitionEnd.mockClear();
  });

  it('Test transition className', () => {
    const Demo: FC<{ in: boolean }> = ({ in: inProp }) => {
      const { nodeRef } = useCssTransition({
        in: inProp,
        transitionClassName: 'demo',
      });

      return <div data-testid='demo' ref={nodeRef} />;
    };

    const { rerender } = render(<Demo in={false} />);

    const el = screen.getByTestId('demo');

    expect(el.className).toBe('');

    rerender(<Demo in={true} />);
    expect(el.classList.length).toBe(2);
    expect(el.classList.contains('demo-enter-from')).toBe(true);
    expect(el.classList.contains('demo-enter-active')).toBe(true);

    act(() => {
      nextFrame.mock.calls[0][0]();
    });

    nextFrame.mockClear();

    expect(el.classList.length).toBe(2);
    expect(el.classList.contains('demo-enter-to')).toBe(true);
    expect(el.classList.contains('demo-enter-active')).toBe(true);

    act(() => {
      onTransitionEnd.mock.calls[0][1]();
    });

    onTransitionEnd.mockClear();

    expect(el.classList.length).toBe(0);

    rerender(<Demo in={false} />);

    expect(el.classList.length).toBe(2);
    expect(el.classList.contains('demo-exit-from')).toBe(true);
    expect(el.classList.contains('demo-exit-active')).toBe(true);

    act(() => {
      nextFrame.mock.calls[0][0]();
    });

    nextFrame.mockClear();

    expect(el.classList.length).toBe(2);
    expect(el.classList.contains('demo-exit-to')).toBe(true);
    expect(el.classList.contains('demo-exit-active')).toBe(true);

    act(() => {
      onTransitionEnd.mock.calls[0][1]();
    });
    onTransitionEnd.mockClear();

    expect(el.classList.length).toBe(0);
  });

  it('Test transition cancelled', () => {
    const Demo: FC<{ in: boolean }> = ({ in: inProp }) => {
      const { nodeRef } = useCssTransition({
        in: inProp,
        transitionClassName: 'demo',
      });

      return <div data-testid='demo' ref={nodeRef} />;
    };

    const { rerender } = render(<Demo in={false} />);

    const el = screen.getByTestId('demo');

    expect(el.className).toBe('');

    rerender(<Demo in={true} />);
    expect(el.classList.length).toBe(2);
    expect(el.classList.contains('demo-enter-from')).toBe(true);
    expect(el.classList.contains('demo-enter-active')).toBe(true);

    act(() => {
      nextFrame.mock.calls[0][0]();
    });

    nextFrame.mockClear();

    expect(el.classList.length).toBe(2);
    expect(el.classList.contains('demo-enter-to')).toBe(true);
    expect(el.classList.contains('demo-enter-active')).toBe(true);

    rerender(<Demo in={false} />);

    expect(el.classList.length).toBe(2);
    expect(el.classList.contains('demo-exit-from')).toBe(true);
    expect(el.classList.contains('demo-exit-active')).toBe(true);
  });

  it('Test timeout', () => {
    const Demo: FC<{ in: boolean }> = ({ in: inProp }) => {
      jest.useFakeTimers();

      const { nodeRef } = useCssTransition({
        in: inProp,
        timeout: 100,
        transitionClassName: 'demo',
      });

      return <div data-testid='demo' ref={nodeRef} />;
    };

    const { rerender } = render(<Demo in={false} />);

    const el = screen.getByTestId('demo');

    expect(el.className).toBe('');

    rerender(<Demo in={true} />);
    expect(el.classList.length).toBe(2);
    expect(el.classList.contains('demo-enter-from')).toBe(true);
    expect(el.classList.contains('demo-enter-active')).toBe(true);

    act(() => {
      nextFrame.mock.calls[0][0]();
    });

    nextFrame.mockClear();

    expect(el.classList.length).toBe(2);
    expect(el.classList.contains('demo-enter-to')).toBe(true);
    expect(el.classList.contains('demo-enter-active')).toBe(true);

    act(() => {
      jest.runAllTimers();
    });

    expect(el.classList.length).toBe(0);

    rerender(<Demo in={false} />);
    expect(el.classList.length).toBe(2);
    expect(el.classList.contains('demo-exit-from')).toBe(true);
    expect(el.classList.contains('demo-exit-active')).toBe(true);

    act(() => {
      nextFrame.mock.calls[0][0]();
    });

    nextFrame.mockClear();

    expect(el.classList.length).toBe(2);
    expect(el.classList.contains('demo-exit-to')).toBe(true);
    expect(el.classList.contains('demo-exit-active')).toBe(true);

    act(() => {
      jest.runAllTimers();
    });

    expect(el.classList.length).toBe(0);
  });

  it('Test disableCss', () => {
    const fn = jest.fn<void, Array<any>>();

    const Demo: FC<{ in: boolean }> = ({ in: inProp }) => {
      jest.useFakeTimers();

      const { nodeRef } = useCssTransition({
        in: inProp,
        disableCss: true,
        transitionClassName: 'demo',
        onEntering: fn,
        onExiting: fn,
      });

      return <div data-testid='demo' ref={nodeRef} />;
    };

    const { rerender } = render(<Demo in={false} />);

    const el = screen.getByTestId('demo');

    expect(el.className).toBe('');

    rerender(<Demo in={true} />);
    expect(el.classList.length).toBe(2);
    expect(el.classList.contains('demo-enter-from')).toBe(true);
    expect(el.classList.contains('demo-enter-active')).toBe(true);

    act(() => {
      nextFrame.mock.calls[0][0]();
    });

    nextFrame.mockClear();

    expect(el.classList.length).toBe(2);
    expect(el.classList.contains('demo-enter-to')).toBe(true);
    expect(el.classList.contains('demo-enter-active')).toBe(true);

    expect(onTransitionEnd.mock.calls.length).toBe(0);

    expect(fn.mock.calls.length).toBe(1);

    fn.mock.calls[0][1]();

    fn.mockClear();

    expect(el.classList.length).toBe(0);

    rerender(<Demo in={false} />);
    expect(el.classList.length).toBe(2);
    expect(el.classList.contains('demo-exit-from')).toBe(true);
    expect(el.classList.contains('demo-exit-active')).toBe(true);

    act(() => {
      nextFrame.mock.calls[0][0]();
    });

    nextFrame.mockClear();

    expect(el.classList.length).toBe(2);
    expect(el.classList.contains('demo-exit-to')).toBe(true);
    expect(el.classList.contains('demo-exit-active')).toBe(true);

    expect(onTransitionEnd.mock.calls.length).toBe(0);

    expect(fn.mock.calls.length).toBe(1);

    act(() => {
      fn.mock.calls[0][1]();
    });

    expect(el.classList.length).toBe(0);
  });
});
