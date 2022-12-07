/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Transition } from '@xl-vision/react';
import { noop } from '@xl-vision/utils';
import * as utils from '@xl-vision/utils';
import { CssTransitionClassNameRecord } from '@xl-vision/hooks';
import { act, render, screen } from '@testing-library/react';

const classnameMap: CssTransitionClassNameRecord = {
  appearFrom: 'appearFrom',
  appearActive: 'appearActive',
  appearTo: 'appearTo',
  enterFrom: 'enterFrom',
  enterActive: 'enterActive',
  enterTo: 'enterTo',
  exitFrom: 'exitFrom',
  exitActive: 'exitActive',
  exitTo: 'exitTo',
  disappearFrom: 'disappearFrom',
  disappearActive: 'disappearActive',
  disappearTo: 'disappearTo',
};

const onTransitionEndSpy = jest.spyOn(utils, 'onTransitionEnd').mockImplementation();
const nextFrameSpy = jest.spyOn(utils, 'nextFrame').mockImplementation();

describe('Transition', () => {
  const call = jest.fn();

  afterEach(() => {
    onTransitionEndSpy.mockClear();
    nextFrameSpy.mockClear();
    call.mockClear();
  });

  it('Test lifecycle when transitionOnFirst is true and in is true', () => {
    const Demo = ({ in: inProp }: { in: boolean }) => {
      return (
        <Transition
          in={inProp}
          transitionOnFirst={true}
          onEnter={(_el, transitionOnFirst) => {
            call(transitionOnFirst ? 'beforeAppear' : 'beforeEnter');
          }}
          onEnterCancelled={(_el, transitionOnFirst) => {
            call(transitionOnFirst ? 'appearCancelled' : 'enterCancelled');
          }}
          onEntered={(_el, transitionOnFirst) => {
            call(transitionOnFirst ? 'afterAppear' : 'afterEnter');
          }}
          onEntering={(_el, _done, transitionOnFirst, isCancelled) => {
            if (!isCancelled()) {
              call(transitionOnFirst ? 'appear' : 'enter');
            }
          }}
          onExit={(_el, transitionOnFirst) => {
            call(transitionOnFirst ? 'beforeDisappear' : 'beforeExit');
          }}
          onExitCancelled={(_el, transitionOnFirst) => {
            call(transitionOnFirst ? 'disappearCancelled' : 'exitCancelled');
          }}
          onExited={(_el, transitionOnFirst) => {
            call(transitionOnFirst ? 'afterDisappear' : 'afterExit');
          }}
          onExiting={(_el, _done, transitionOnFirst, isCancelled) => {
            if (!isCancelled()) {
              call(transitionOnFirst ? 'disappear' : 'exit');
            }
          }}
        >
          <div />
        </Transition>
      );
    };

    const { rerender } = render(<Demo in={true} />);

    let nextFrameCalls = nextFrameSpy.mock.calls;

    expect(nextFrameCalls.length).toBe(1);

    act(() => {
      nextFrameCalls[0][0]();
    });

    let onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);

    act(() => {
      onTransitionEndCalls[0][1]();
    });

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeAppear');
    expect(call.mock.calls[1][0]).toBe('appear');
    expect(call.mock.calls[2][0]).toBe('afterAppear');
    call.mockClear();
    nextFrameSpy.mockClear();
    onTransitionEndSpy.mockClear();

    rerender(<Demo in={false} />);

    nextFrameCalls = nextFrameSpy.mock.calls;

    expect(nextFrameCalls.length).toBe(1);

    act(() => {
      nextFrameCalls[0][0]();
    });

    onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);

    act(() => {
      onTransitionEndCalls[0][1]();
    });

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeExit');
    expect(call.mock.calls[1][0]).toBe('exit');
    expect(call.mock.calls[2][0]).toBe('afterExit');
    call.mockClear();
    nextFrameSpy.mockClear();
    onTransitionEndSpy.mockClear();

    rerender(<Demo in={true} />);

    nextFrameCalls = nextFrameSpy.mock.calls;

    expect(nextFrameCalls.length).toBe(1);

    act(() => {
      nextFrameCalls[0][0]();
    });

    onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);

    act(() => {
      onTransitionEndCalls[0][1]();
    });

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeEnter');
    expect(call.mock.calls[1][0]).toBe('enter');
    expect(call.mock.calls[2][0]).toBe('afterEnter');
    call.mockClear();
  });

  it('Test lifecycle when transitionOnFirst is true and in is false', () => {
    const Demo = ({ in: inProp }: { in: boolean }) => {
      return (
        <Transition
          in={inProp}
          transitionClassName={classnameMap}
          transitionOnFirst={true}
          onEnter={(_el, transitionOnFirst) => {
            call(transitionOnFirst ? 'beforeAppear' : 'beforeEnter');
          }}
          onEnterCancelled={(_el, transitionOnFirst) => {
            call(transitionOnFirst ? 'appearCancelled' : 'enterCancelled');
          }}
          onEntered={(_el, transitionOnFirst) => {
            call(transitionOnFirst ? 'afterAppear' : 'afterEnter');
          }}
          onEntering={(_el, _done, transitionOnFirst, isCancelled) => {
            if (!isCancelled()) {
              call(transitionOnFirst ? 'appear' : 'enter');
            }
          }}
          onExit={(_el, transitionOnFirst) => {
            call(transitionOnFirst ? 'beforeDisappear' : 'beforeExit');
          }}
          onExitCancelled={(_el, transitionOnFirst) => {
            call(transitionOnFirst ? 'disappearCancelled' : 'exitCancelled');
          }}
          onExited={(_el, transitionOnFirst) => {
            call(transitionOnFirst ? 'afterDisappear' : 'afterExit');
          }}
          onExiting={(_el, _done, transitionOnFirst, isCancelled) => {
            if (!isCancelled()) {
              call(transitionOnFirst ? 'disappear' : 'exit');
            }
          }}
        >
          <div />
        </Transition>
      );
    };

    const { rerender } = render(<Demo in={false} />);

    let nextFrameCalls = nextFrameSpy.mock.calls;

    expect(nextFrameCalls.length).toBe(1);

    act(() => {
      nextFrameCalls[0][0]();
    });

    let onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);

    act(() => {
      onTransitionEndCalls[0][1]();
    });

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeDisappear');
    expect(call.mock.calls[1][0]).toBe('disappear');
    expect(call.mock.calls[2][0]).toBe('afterDisappear');

    call.mockClear();
    nextFrameSpy.mockClear();
    onTransitionEndSpy.mockClear();

    rerender(<Demo in={true} />);

    nextFrameCalls = nextFrameSpy.mock.calls;

    expect(nextFrameCalls.length).toBe(1);

    act(() => {
      nextFrameCalls[0][0]();
    });

    onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);

    act(() => {
      onTransitionEndCalls[0][1]();
    });

    expect(call.mock.calls[0][0]).toBe('beforeEnter');
    expect(call.mock.calls[1][0]).toBe('enter');
    expect(call.mock.calls[2][0]).toBe('afterEnter');

    call.mockClear();
    nextFrameSpy.mockClear();
    onTransitionEndSpy.mockClear();

    rerender(<Demo in={false} />);

    nextFrameCalls = nextFrameSpy.mock.calls;

    expect(nextFrameCalls.length).toBe(1);

    act(() => {
      nextFrameCalls[0][0]();
    });

    onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);

    act(() => {
      onTransitionEndCalls[0][1]();
    });

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeExit');
    expect(call.mock.calls[1][0]).toBe('exit');
    expect(call.mock.calls[2][0]).toBe('afterExit');

    call.mockClear();
    nextFrameSpy.mockClear();
    onTransitionEndSpy.mockClear();

    rerender(<Demo in={true} />);

    nextFrameCalls = nextFrameSpy.mock.calls;

    expect(nextFrameCalls.length).toBe(1);

    act(() => {
      nextFrameCalls[0][0]();
    });

    onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);

    act(() => {
      onTransitionEndCalls[0][1]();
    });
    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeEnter');
    expect(call.mock.calls[1][0]).toBe('enter');
    expect(call.mock.calls[2][0]).toBe('afterEnter');
    call.mockClear();
  });

  it('Test lifycycle when in is false and transitionOnFirst is not set', () => {
    const Demo = ({ in: inProp }: { in: boolean }) => {
      return (
        <Transition
          in={inProp}
          transitionClassName={classnameMap}
          onEnter={(_el, transitionOnFirst) => {
            call(transitionOnFirst ? 'beforeAppear' : 'beforeEnter');
          }}
          onEnterCancelled={(_el, transitionOnFirst) => {
            call(transitionOnFirst ? 'appearCancelled' : 'enterCancelled');
          }}
          onEntered={(_el, transitionOnFirst) => {
            call(transitionOnFirst ? 'afterAppear' : 'afterEnter');
          }}
          onEntering={(_el, _done, transitionOnFirst, isCancelled) => {
            if (!isCancelled()) {
              call(transitionOnFirst ? 'appear' : 'enter');
            }
          }}
          onExit={(_el, transitionOnFirst) => {
            call(transitionOnFirst ? 'beforeDisappear' : 'beforeExit');
          }}
          onExitCancelled={(_el, transitionOnFirst) => {
            call(transitionOnFirst ? 'disappearCancelled' : 'exitCancelled');
          }}
          onExited={(_el, transitionOnFirst) => {
            call(transitionOnFirst ? 'afterDisappear' : 'afterExit');
          }}
          onExiting={(_el, _done, transitionOnFirst, isCancelled) => {
            if (!isCancelled()) {
              call(transitionOnFirst ? 'disappear' : 'exit');
            }
          }}
        >
          <div />
        </Transition>
      );
    };
    const { rerender } = render(<Demo in={false} />);

    let nextFrameCalls = nextFrameSpy.mock.calls;
    expect(nextFrameCalls.length).toBe(0);

    let onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(0);

    expect(call.mock.calls.length).toBe(0);

    rerender(<Demo in={true} />);

    nextFrameCalls = nextFrameSpy.mock.calls;

    expect(nextFrameCalls.length).toBe(1);

    act(() => {
      nextFrameCalls[0][0]();
    });

    onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);

    act(() => {
      onTransitionEndCalls[0][1]();
    });

    expect(call.mock.calls[0][0]).toBe('beforeEnter');
    expect(call.mock.calls[1][0]).toBe('enter');
    expect(call.mock.calls[2][0]).toBe('afterEnter');

    call.mockClear();
    nextFrameSpy.mockClear();
    onTransitionEndSpy.mockClear();

    rerender(<Demo in={false} />);

    nextFrameCalls = nextFrameSpy.mock.calls;

    expect(nextFrameCalls.length).toBe(1);

    act(() => {
      nextFrameCalls[0][0]();
    });

    onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);

    act(() => {
      onTransitionEndCalls[0][1]();
    });

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeExit');
    expect(call.mock.calls[1][0]).toBe('exit');
    expect(call.mock.calls[2][0]).toBe('afterExit');

    call.mockClear();
    nextFrameSpy.mockClear();
    onTransitionEndSpy.mockClear();

    rerender(<Demo in={true} />);

    nextFrameCalls = nextFrameSpy.mock.calls;

    expect(nextFrameCalls.length).toBe(1);

    act(() => {
      nextFrameCalls[0][0]();
    });

    onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);

    act(() => {
      onTransitionEndCalls[0][1]();
    });

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeEnter');
    expect(call.mock.calls[1][0]).toBe('enter');
    expect(call.mock.calls[2][0]).toBe('afterEnter');
  });

  it('Test lifecycle when in is true and transitionOnFirst is not set', () => {
    const Demo = ({ in: inProp }: { in: boolean }) => {
      return (
        <Transition
          in={inProp}
          transitionClassName={classnameMap}
          onEnter={(_el, transitionOnFirst) => {
            call(transitionOnFirst ? 'beforeAppear' : 'beforeEnter');
          }}
          onEnterCancelled={(_el, transitionOnFirst) => {
            call(transitionOnFirst ? 'appearCancelled' : 'enterCancelled');
          }}
          onEntered={(_el, transitionOnFirst) => {
            call(transitionOnFirst ? 'afterAppear' : 'afterEnter');
          }}
          onEntering={(_el, _done, transitionOnFirst, isCancelled) => {
            if (!isCancelled()) {
              call(transitionOnFirst ? 'appear' : 'enter');
            }
          }}
          onExit={(_el, transitionOnFirst) => {
            call(transitionOnFirst ? 'beforeDisappear' : 'beforeExit');
          }}
          onExitCancelled={(_el, transitionOnFirst) => {
            call(transitionOnFirst ? 'disappearCancelled' : 'exitCancelled');
          }}
          onExited={(_el, transitionOnFirst) => {
            call(transitionOnFirst ? 'afterDisappear' : 'afterExit');
          }}
          onExiting={(_el, _done, transitionOnFirst, isCancelled) => {
            if (!isCancelled()) {
              call(transitionOnFirst ? 'disappear' : 'exit');
            }
          }}
        >
          <div />
        </Transition>
      );
    };
    const { rerender } = render(<Demo in={true} />);

    let nextFrameCalls = nextFrameSpy.mock.calls;
    expect(nextFrameCalls.length).toBe(0);

    let onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(0);

    expect(call.mock.calls.length).toBe(0);

    rerender(<Demo in={false} />);

    nextFrameCalls = nextFrameSpy.mock.calls;

    expect(nextFrameCalls.length).toBe(1);

    act(() => {
      nextFrameCalls[0][0]();
    });

    onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);

    act(() => {
      onTransitionEndCalls[0][1]();
    });

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeExit');
    expect(call.mock.calls[1][0]).toBe('exit');
    expect(call.mock.calls[2][0]).toBe('afterExit');
    call.mockClear();
    nextFrameSpy.mockClear();
    onTransitionEndSpy.mockClear();

    rerender(<Demo in={true} />);

    nextFrameCalls = nextFrameSpy.mock.calls;

    expect(nextFrameCalls.length).toBe(1);

    act(() => {
      nextFrameCalls[0][0]();
    });

    onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);

    act(() => {
      onTransitionEndCalls[0][1]();
    });

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeEnter');
    expect(call.mock.calls[1][0]).toBe('enter');
    expect(call.mock.calls[2][0]).toBe('afterEnter');
  });

  it('Test lifecycle include cancel event', () => {
    const Demo = ({ in: inProp }: { in: boolean }) => {
      return (
        <Transition
          in={inProp}
          transitionClassName={classnameMap}
          transitionOnFirst={true}
          onEnter={(_el, transitionOnFirst) => {
            call(transitionOnFirst ? 'beforeAppear' : 'beforeEnter');
          }}
          onEnterCancelled={(_el, transitionOnFirst) => {
            call(transitionOnFirst ? 'appearCancelled' : 'enterCancelled');
          }}
          onEntered={(_el, transitionOnFirst) => {
            call(transitionOnFirst ? 'afterAppear' : 'afterEnter');
          }}
          onEntering={(_el, _done, transitionOnFirst, isCancelled) => {
            if (!isCancelled()) {
              call(transitionOnFirst ? 'appear' : 'enter');
            }
          }}
          onExit={(_el, transitionOnFirst) => {
            call(transitionOnFirst ? 'beforeDisappear' : 'beforeExit');
          }}
          onExitCancelled={(_el, transitionOnFirst) => {
            call(transitionOnFirst ? 'disappearCancelled' : 'exitCancelled');
          }}
          onExited={(_el, transitionOnFirst) => {
            call(transitionOnFirst ? 'afterDisappear' : 'afterExit');
          }}
          onExiting={(_el, _done, transitionOnFirst, isCancelled) => {
            if (!isCancelled()) {
              call(transitionOnFirst ? 'disappear' : 'exit');
            }
          }}
        >
          <div />
        </Transition>
      );
    };

    const { rerender } = render(<Demo in={true} />);

    let nextFrameCalls = nextFrameSpy.mock.calls;
    expect(nextFrameCalls.length).toBe(1);

    act(() => {
      nextFrameCalls[0][0]();
    });

    let onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);

    expect(call.mock.calls.length).toBe(2);
    expect(call.mock.calls[0][0]).toBe('beforeAppear');
    expect(call.mock.calls[1][0]).toBe('appear');

    call.mockClear();
    nextFrameSpy.mockClear();
    onTransitionEndSpy.mockClear();

    rerender(<Demo in={false} />);

    nextFrameCalls = nextFrameSpy.mock.calls;
    expect(nextFrameCalls.length).toBe(1);

    act(() => {
      nextFrameCalls[0][0]();
    });

    onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);

    expect(call.mock.calls.length).toBe(3);

    expect(call.mock.calls[0][0]).toBe('appearCancelled');
    expect(call.mock.calls[1][0]).toBe('beforeExit');
    expect(call.mock.calls[2][0]).toBe('exit');

    call.mockClear();
    nextFrameSpy.mockClear();
    onTransitionEndSpy.mockClear();

    rerender(<Demo in={true} />);

    nextFrameCalls = nextFrameSpy.mock.calls;
    expect(nextFrameCalls.length).toBe(1);

    act(() => {
      nextFrameCalls[0][0]();
    });

    onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('exitCancelled');
    expect(call.mock.calls[1][0]).toBe('beforeEnter');
    expect(call.mock.calls[2][0]).toBe('enter');

    call.mockClear();
    nextFrameSpy.mockClear();
    onTransitionEndSpy.mockClear();

    rerender(<Demo in={false} />);

    nextFrameCalls = nextFrameSpy.mock.calls;
    expect(nextFrameCalls.length).toBe(1);

    act(() => {
      nextFrameCalls[0][0]();
    });

    onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);
    act(() => {
      onTransitionEndCalls[0][1]();
    });

    expect(call.mock.calls.length).toBe(4);
    expect(call.mock.calls[0][0]).toBe('enterCancelled');
    expect(call.mock.calls[1][0]).toBe('beforeExit');
    expect(call.mock.calls[2][0]).toBe('exit');
    expect(call.mock.calls[3][0]).toBe('afterExit');
  });

  it('Test contains className call timing', () => {
    const { rerender } = render(
      <Transition in={true} transitionClassName='test' transitionOnFirst={true}>
        <div data-testid='demo' />
      </Transition>,
    );

    const div = screen.getByTestId('demo');

    // nextFrame未执行
    expect(div.classList).toContain('test-appear-from');
    expect(div.classList).toContain('test-appear-active');

    let nextFrameCalls = nextFrameSpy.mock.calls;
    expect(nextFrameCalls.length).toBe(1);

    act(() => {
      nextFrameCalls[0][0]();
    });

    let onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);

    expect(div.classList).not.toContain('test-appear-from');
    expect(div.classList).toContain('test-appear-active');
    expect(div.classList).toContain('test-appear-to');

    act(() => {
      onTransitionEndCalls[0][1]();
    });

    expect(div.classList).not.toContain('test-appear-active');
    expect(div.classList).not.toContain('test-appear-to');

    onTransitionEndSpy.mockClear();
    nextFrameSpy.mockClear();

    rerender(
      <Transition in={false} transitionClassName='test' transitionOnFirst={true}>
        <div />
      </Transition>,
    );

    // nextFrame未执行
    expect(div.classList).toContain('test-exit-from');
    expect(div.classList).toContain('test-exit-active');

    nextFrameCalls = nextFrameSpy.mock.calls;
    expect(nextFrameCalls.length).toBe(1);

    act(() => {
      nextFrameCalls[0][0]();
    });

    onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);

    expect(div.classList).not.toContain('test-exit-from');
    expect(div.classList).toContain('test-exit-active');
    expect(div.classList).toContain('test-exit-to');

    act(() => {
      onTransitionEndCalls[0][1]();
    });

    expect(div.classList).not.toContain('test-exit-active');
    expect(div.classList).not.toContain('test-exit-to');

    onTransitionEndSpy.mockClear();
    nextFrameSpy.mockClear();

    rerender(
      <Transition in={true} transitionClassName='test' transitionOnFirst={true}>
        <div />
      </Transition>,
    );
    // nextFrame未执行
    expect(div.classList).toContain('test-enter-from');
    expect(div.classList).toContain('test-enter-active');

    nextFrameCalls = nextFrameSpy.mock.calls;
    expect(nextFrameCalls.length).toBe(1);

    act(() => {
      nextFrameCalls[0][0]();
    });

    onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);

    expect(div.classList).not.toContain('test-enter-from');
    expect(div.classList).toContain('test-enter-active');
    expect(div.classList).toContain('test-enter-to');

    act(() => {
      onTransitionEndCalls[0][1]();
    });

    expect(div.classList).not.toContain('test-enter-active');
    expect(div.classList).not.toContain('test-enter-to');

    onTransitionEndSpy.mockClear();
    nextFrameSpy.mockClear();
  });

  it('Test timeout call timing', () => {
    onTransitionEndSpy.mockImplementation((_, cb) => {
      cb();
      return noop;
    });

    jest.useFakeTimers();
    const { rerender } = render(
      <Transition in={true} timeout={20} transitionClassName='test' transitionOnFirst={true}>
        <div data-testid='demo' />
      </Transition>,
    );

    const div = screen.getByTestId('demo');

    expect(div.classList).toContain('test-appear-from');
    expect(div.classList).toContain('test-appear-active');

    nextFrameSpy.mock.calls[0][0]();

    expect(div.classList).not.toContain('test-appear-from');
    expect(div.classList).toContain('test-appear-active');
    expect(div.classList).toContain('test-appear-to');

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(div.classList).not.toContain('test-appear-active');
    expect(div.classList).not.toContain('test-appear-to');

    nextFrameSpy.mockClear();

    rerender(
      <Transition in={false} timeout={20} transitionClassName='test' transitionOnFirst={true}>
        <div />
      </Transition>,
    );

    expect(div.classList).toContain('test-exit-from');
    expect(div.classList).toContain('test-exit-active');

    nextFrameSpy.mock.calls[0][0]();

    expect(div.classList).not.toContain('test-exit-from');
    expect(div.classList).toContain('test-exit-active');
    expect(div.classList).toContain('test-exit-to');

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(div.classList).not.toContain('test-exit-active');
    expect(div.classList).not.toContain('test-exit-to');

    nextFrameSpy.mockClear();

    rerender(
      <Transition in={true} timeout={20} transitionClassName='test' transitionOnFirst={true}>
        <div />
      </Transition>,
    );

    expect(div.classList).toContain('test-enter-from');
    expect(div.classList).toContain('test-enter-active');

    nextFrameSpy.mock.calls[0][0]();

    expect(div.classList).not.toContain('test-enter-from');
    expect(div.classList).toContain('test-enter-active');
    expect(div.classList).toContain('test-enter-to');

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(div.classList).not.toContain('test-enter-active');
    expect(div.classList).not.toContain('test-enter-to');
  });
});
