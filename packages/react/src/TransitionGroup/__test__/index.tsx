/* eslint-disable @typescript-eslint/no-unsafe-return */
import { render } from '@testing-library/react';
import { noop } from '@xl-vision/utils';
import * as utils from '@xl-vision/utils';
import { triggerTransitionEnd } from 'test/utils';
import TransitionGroup from '..';

describe('TransitionGroup', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('Check if the order is correct', () => {
    const prevArr = [1, 2, 3, 4, 5];
    const nextArr = [2, 1, 4, 6, 5];
    const expectArr = [2, 1, 3, 4, 6, 5];
    const Comp = (props: { arr: Array<number> }) => {
      const { arr } = props;
      const children = arr.map((it) => <div key={it}>{it}</div>);
      return <TransitionGroup transitionClassName='demo'>{children}</TransitionGroup>;
    };
    const { rerender, container } = render(<Comp arr={prevArr} />);
    expect(container.textContent).toBe(prevArr.map((it) => it.toString()).reduce((a, b) => a + b));

    rerender(<Comp arr={nextArr} />);

    expect(container.textContent).toBe(
      expectArr.map((it) => it.toString()).reduce((a, b) => a + b),
    );
  });

  it('test hooks', async () => {
    jest.spyOn(utils, 'nextFrame').mockImplementation((fn: () => void) => {
      fn();
      return noop;
    });

    const prevArr = [1];
    const nextArr = [2];
    const nextArr2 = [3];
    const fn = jest.fn();
    const Comp = (props: { arr: Array<number> }) => {
      const { arr } = props;
      const children = arr.map((it) => (
        // 阻止执行exit动作
        <div key={it}>{it}</div>
      ));
      return (
        <TransitionGroup
          onEnter={() => fn('beforeEnter')}
          onEntered={() => fn('afterEnter')}
          onEntering={() => fn('enter')}
          onExit={() => fn('beforeExit')}
          onExited={() => fn('afterExit')}
          onExiting={() => fn('exit')}
        >
          {children}
        </TransitionGroup>
      );
    };
    const { rerender } = render(<Comp arr={prevArr} />);

    await triggerTransitionEnd();

    expect(fn.mock.calls.length).toBe(0);

    rerender(<Comp arr={nextArr} />);

    await triggerTransitionEnd();

    expect(fn.mock.calls.length).toBe(6);
    rerender(<Comp arr={nextArr} />);

    await triggerTransitionEnd();

    expect(fn.mock.calls.length).toBe(6);

    rerender(<Comp arr={nextArr2} />);

    await triggerTransitionEnd();

    expect(fn.mock.calls.length).toBe(6 * 2);
  });
});
