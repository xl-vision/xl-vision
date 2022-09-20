/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { mount } from 'enzyme';

import { Transition } from '@xl-vision/react';
import { noop } from '@xl-vision/utils';
import * as utils from '@xl-vision/utils';
import { CssTransitionClassNameRecord } from '@xl-vision/hooks';

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

describe('Transition', () => {
  const onTransitionEndSpy = jest.spyOn(utils, 'onTransitionEnd').mockImplementation();
  const nextFrameSpy = jest.spyOn(utils, 'nextFrame').mockImplementation();
  const call = jest.fn();

  afterEach(() => {
    onTransitionEndSpy.mockClear();
    nextFrameSpy.mockClear();
    call.mockClear();
  });

  it('测试设置transitionOnFirst为true且in为true生命周期', () => {
    const wrapper = mount(
      <Transition
        in={true}
        transitionOnFirst={true}
        onEnter={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'beforeAppear' : 'beforeEnter');
        }}
        onEntering={(_el, _done, transitionOnFirst, isCancelled) => {
          if (!isCancelled()) {
            call(transitionOnFirst ? 'appear' : 'enter');
          }
        }}
        onEntered={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'afterAppear' : 'afterEnter');
        }}
        onEnterCancelled={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'appearCancelled' : 'enterCancelled');
        }}
        onExit={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'beforeDisappear' : 'beforeExit');
        }}
        onExiting={(_el, _done, transitionOnFirst, isCancelled) => {
          if (!isCancelled()) {
            call(transitionOnFirst ? 'disappear' : 'exit');
          }
        }}
        onExited={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'afterDisappear' : 'afterExit');
        }}
        onExitCancelled={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'disappearCancelled' : 'exitCancelled');
        }}
      >
        <div />
      </Transition>,
    );

    let nextFrameCalls = nextFrameSpy.mock.calls;

    expect(nextFrameCalls.length).toBe(1);

    nextFrameCalls[0][0]();

    let onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);

    onTransitionEndCalls[0][1]();

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeAppear');
    expect(call.mock.calls[1][0]).toBe('appear');
    expect(call.mock.calls[2][0]).toBe('afterAppear');
    call.mockClear();
    nextFrameSpy.mockClear();
    onTransitionEndSpy.mockClear();

    wrapper.setProps({
      in: false,
    });

    nextFrameCalls = nextFrameSpy.mock.calls;

    expect(nextFrameCalls.length).toBe(1);

    nextFrameCalls[0][0]();

    onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);

    onTransitionEndCalls[0][1]();

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeExit');
    expect(call.mock.calls[1][0]).toBe('exit');
    expect(call.mock.calls[2][0]).toBe('afterExit');
    call.mockClear();
    nextFrameSpy.mockClear();
    onTransitionEndSpy.mockClear();

    wrapper.setProps({
      in: true,
    });

    nextFrameCalls = nextFrameSpy.mock.calls;

    expect(nextFrameCalls.length).toBe(1);

    nextFrameCalls[0][0]();

    onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);

    onTransitionEndCalls[0][1]();

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeEnter');
    expect(call.mock.calls[1][0]).toBe('enter');
    expect(call.mock.calls[2][0]).toBe('afterEnter');
    call.mockClear();
  });

  it('测试设置transitionOnFirst为true且in为false生命周期', () => {
    const wrapper = mount(
      <Transition
        in={false}
        transitionOnFirst={true}
        transitionClassName={classnameMap}
        onEnter={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'beforeAppear' : 'beforeEnter');
        }}
        onEntering={(_el, _done, transitionOnFirst, isCancelled) => {
          if (!isCancelled()) {
            call(transitionOnFirst ? 'appear' : 'enter');
          }
        }}
        onEntered={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'afterAppear' : 'afterEnter');
        }}
        onEnterCancelled={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'appearCancelled' : 'enterCancelled');
        }}
        onExit={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'beforeDisappear' : 'beforeExit');
        }}
        onExiting={(_el, _done, transitionOnFirst, isCancelled) => {
          if (!isCancelled()) {
            call(transitionOnFirst ? 'disappear' : 'exit');
          }
        }}
        onExited={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'afterDisappear' : 'afterExit');
        }}
        onExitCancelled={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'disappearCancelled' : 'exitCancelled');
        }}
      >
        <div />
      </Transition>,
    );

    let nextFrameCalls = nextFrameSpy.mock.calls;

    expect(nextFrameCalls.length).toBe(1);

    nextFrameCalls[0][0]();

    let onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);

    onTransitionEndCalls[0][1]();

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeDisappear');
    expect(call.mock.calls[1][0]).toBe('disappear');
    expect(call.mock.calls[2][0]).toBe('afterDisappear');

    call.mockClear();
    nextFrameSpy.mockClear();
    onTransitionEndSpy.mockClear();

    wrapper.setProps({
      in: true,
    });

    nextFrameCalls = nextFrameSpy.mock.calls;

    expect(nextFrameCalls.length).toBe(1);

    nextFrameCalls[0][0]();

    onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);

    onTransitionEndCalls[0][1]();

    expect(call.mock.calls[0][0]).toBe('beforeEnter');
    expect(call.mock.calls[1][0]).toBe('enter');
    expect(call.mock.calls[2][0]).toBe('afterEnter');

    call.mockClear();
    nextFrameSpy.mockClear();
    onTransitionEndSpy.mockClear();

    wrapper.setProps({
      in: false,
    });

    nextFrameCalls = nextFrameSpy.mock.calls;

    expect(nextFrameCalls.length).toBe(1);

    nextFrameCalls[0][0]();

    onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);

    onTransitionEndCalls[0][1]();

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeExit');
    expect(call.mock.calls[1][0]).toBe('exit');
    expect(call.mock.calls[2][0]).toBe('afterExit');

    call.mockClear();
    nextFrameSpy.mockClear();
    onTransitionEndSpy.mockClear();

    wrapper.setProps({
      in: true,
    });

    nextFrameCalls = nextFrameSpy.mock.calls;

    expect(nextFrameCalls.length).toBe(1);

    nextFrameCalls[0][0]();

    onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);

    onTransitionEndCalls[0][1]();
    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeEnter');
    expect(call.mock.calls[1][0]).toBe('enter');
    expect(call.mock.calls[2][0]).toBe('afterEnter');
    call.mockClear();
  });

  it('测试不设置transitionOnFirst且in为false时的生命周期', () => {
    const wrapper = mount(
      <Transition
        in={false}
        transitionClassName={classnameMap}
        onEnter={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'beforeAppear' : 'beforeEnter');
        }}
        onEntering={(_el, _done, transitionOnFirst, isCancelled) => {
          if (!isCancelled()) {
            call(transitionOnFirst ? 'appear' : 'enter');
          }
        }}
        onEntered={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'afterAppear' : 'afterEnter');
        }}
        onEnterCancelled={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'appearCancelled' : 'enterCancelled');
        }}
        onExit={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'beforeDisappear' : 'beforeExit');
        }}
        onExiting={(_el, _done, transitionOnFirst, isCancelled) => {
          if (!isCancelled()) {
            call(transitionOnFirst ? 'disappear' : 'exit');
          }
        }}
        onExited={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'afterDisappear' : 'afterExit');
        }}
        onExitCancelled={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'disappearCancelled' : 'exitCancelled');
        }}
      >
        <div />
      </Transition>,
    );

    let nextFrameCalls = nextFrameSpy.mock.calls;
    expect(nextFrameCalls.length).toBe(0);

    let onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(0);

    expect(call.mock.calls.length).toBe(0);

    wrapper.setProps({
      in: true,
    });

    nextFrameCalls = nextFrameSpy.mock.calls;

    expect(nextFrameCalls.length).toBe(1);

    nextFrameCalls[0][0]();

    onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);

    onTransitionEndCalls[0][1]();

    expect(call.mock.calls[0][0]).toBe('beforeEnter');
    expect(call.mock.calls[1][0]).toBe('enter');
    expect(call.mock.calls[2][0]).toBe('afterEnter');

    call.mockClear();
    nextFrameSpy.mockClear();
    onTransitionEndSpy.mockClear();

    wrapper.setProps({
      in: false,
    });

    nextFrameCalls = nextFrameSpy.mock.calls;

    expect(nextFrameCalls.length).toBe(1);

    nextFrameCalls[0][0]();

    onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);

    onTransitionEndCalls[0][1]();

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeExit');
    expect(call.mock.calls[1][0]).toBe('exit');
    expect(call.mock.calls[2][0]).toBe('afterExit');

    call.mockClear();
    nextFrameSpy.mockClear();
    onTransitionEndSpy.mockClear();

    wrapper.setProps({
      in: true,
    });

    nextFrameCalls = nextFrameSpy.mock.calls;

    expect(nextFrameCalls.length).toBe(1);

    nextFrameCalls[0][0]();

    onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);

    onTransitionEndCalls[0][1]();

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeEnter');
    expect(call.mock.calls[1][0]).toBe('enter');
    expect(call.mock.calls[2][0]).toBe('afterEnter');
  });

  it('测试不设置transitionOnFirst且in为true生命周期', () => {
    const wrapper = mount(
      <Transition
        in={true}
        transitionClassName={classnameMap}
        onEnter={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'beforeAppear' : 'beforeEnter');
        }}
        onEntering={(_el, _done, transitionOnFirst, isCancelled) => {
          if (!isCancelled()) {
            call(transitionOnFirst ? 'appear' : 'enter');
          }
        }}
        onEntered={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'afterAppear' : 'afterEnter');
        }}
        onEnterCancelled={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'appearCancelled' : 'enterCancelled');
        }}
        onExit={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'beforeDisappear' : 'beforeExit');
        }}
        onExiting={(_el, _done, transitionOnFirst, isCancelled) => {
          if (!isCancelled()) {
            call(transitionOnFirst ? 'disappear' : 'exit');
          }
        }}
        onExited={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'afterDisappear' : 'afterExit');
        }}
        onExitCancelled={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'disappearCancelled' : 'exitCancelled');
        }}
      >
        <div />
      </Transition>,
    );

    let nextFrameCalls = nextFrameSpy.mock.calls;
    expect(nextFrameCalls.length).toBe(0);

    let onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(0);

    expect(call.mock.calls.length).toBe(0);

    wrapper.setProps({
      in: false,
    });

    nextFrameCalls = nextFrameSpy.mock.calls;

    expect(nextFrameCalls.length).toBe(1);

    nextFrameCalls[0][0]();

    onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);

    onTransitionEndCalls[0][1]();

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeExit');
    expect(call.mock.calls[1][0]).toBe('exit');
    expect(call.mock.calls[2][0]).toBe('afterExit');
    call.mockClear();
    nextFrameSpy.mockClear();
    onTransitionEndSpy.mockClear();

    wrapper.setProps({
      in: true,
    });

    nextFrameCalls = nextFrameSpy.mock.calls;

    expect(nextFrameCalls.length).toBe(1);

    nextFrameCalls[0][0]();

    onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);

    onTransitionEndCalls[0][1]();

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeEnter');
    expect(call.mock.calls[1][0]).toBe('enter');
    expect(call.mock.calls[2][0]).toBe('afterEnter');
  });

  it('测试包含cancelled的生命周期', () => {
    const wrapper = mount(
      <Transition
        in={true}
        transitionOnFirst={true}
        transitionClassName={classnameMap}
        onEnter={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'beforeAppear' : 'beforeEnter');
        }}
        onEntering={(_el, _done, transitionOnFirst, isCancelled) => {
          if (!isCancelled()) {
            call(transitionOnFirst ? 'appear' : 'enter');
          }
        }}
        onEntered={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'afterAppear' : 'afterEnter');
        }}
        onEnterCancelled={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'appearCancelled' : 'enterCancelled');
        }}
        onExit={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'beforeDisappear' : 'beforeExit');
        }}
        onExiting={(_el, _done, transitionOnFirst, isCancelled) => {
          if (!isCancelled()) {
            call(transitionOnFirst ? 'disappear' : 'exit');
          }
        }}
        onExited={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'afterDisappear' : 'afterExit');
        }}
        onExitCancelled={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'disappearCancelled' : 'exitCancelled');
        }}
      >
        <div />
      </Transition>,
    );

    let nextFrameCalls = nextFrameSpy.mock.calls;
    expect(nextFrameCalls.length).toBe(1);

    nextFrameCalls[0][0]();

    let onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);

    expect(call.mock.calls.length).toBe(2);
    expect(call.mock.calls[0][0]).toBe('beforeAppear');
    expect(call.mock.calls[1][0]).toBe('appear');

    call.mockClear();
    nextFrameSpy.mockClear();
    onTransitionEndSpy.mockClear();

    wrapper.setProps({
      in: false,
    });

    nextFrameCalls = nextFrameSpy.mock.calls;
    expect(nextFrameCalls.length).toBe(1);

    nextFrameCalls[0][0]();

    onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);

    expect(call.mock.calls.length).toBe(3);

    expect(call.mock.calls[0][0]).toBe('appearCancelled');
    expect(call.mock.calls[1][0]).toBe('beforeExit');
    expect(call.mock.calls[2][0]).toBe('exit');

    call.mockClear();
    nextFrameSpy.mockClear();
    onTransitionEndSpy.mockClear();

    wrapper.setProps({
      in: true,
    });

    nextFrameCalls = nextFrameSpy.mock.calls;
    expect(nextFrameCalls.length).toBe(1);

    nextFrameCalls[0][0]();

    onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('exitCancelled');
    expect(call.mock.calls[1][0]).toBe('beforeEnter');
    expect(call.mock.calls[2][0]).toBe('enter');

    call.mockClear();
    nextFrameSpy.mockClear();
    onTransitionEndSpy.mockClear();

    wrapper.setProps({
      in: false,
    });

    nextFrameCalls = nextFrameSpy.mock.calls;
    expect(nextFrameCalls.length).toBe(1);

    nextFrameCalls[0][0]();

    onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);
    onTransitionEndCalls[0][1]();

    expect(call.mock.calls.length).toBe(4);
    expect(call.mock.calls[0][0]).toBe('enterCancelled');
    expect(call.mock.calls[1][0]).toBe('beforeExit');
    expect(call.mock.calls[2][0]).toBe('exit');
    expect(call.mock.calls[3][0]).toBe('afterExit');
  });

  it('测试包含className调用时机', () => {
    const wrapper = mount(
      <Transition transitionOnFirst={true} in={true} transitionClassName='test'>
        <div />
      </Transition>,
    );
    // nextFrame未执行
    expect(wrapper.getDOMNode().classList).toContain('test-appear-from');
    expect(wrapper.getDOMNode().classList).toContain('test-appear-active');

    let nextFrameCalls = nextFrameSpy.mock.calls;
    expect(nextFrameCalls.length).toBe(1);

    nextFrameCalls[0][0]();

    let onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);

    expect(wrapper.getDOMNode().classList).not.toContain('test-appear-from');
    expect(wrapper.getDOMNode().classList).toContain('test-appear-active');
    expect(wrapper.getDOMNode().classList).toContain('test-appear-to');

    onTransitionEndCalls[0][1]();

    expect(wrapper.getDOMNode().classList).not.toContain('test-appear-active');
    expect(wrapper.getDOMNode().classList).not.toContain('test-appear-to');

    onTransitionEndSpy.mockClear();
    nextFrameSpy.mockClear();

    wrapper.setProps({
      in: false,
    });

    // nextFrame未执行
    expect(wrapper.getDOMNode().classList).toContain('test-exit-from');
    expect(wrapper.getDOMNode().classList).toContain('test-exit-active');

    nextFrameCalls = nextFrameSpy.mock.calls;
    expect(nextFrameCalls.length).toBe(1);

    nextFrameCalls[0][0]();

    onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);

    expect(wrapper.getDOMNode().classList).not.toContain('test-exit-from');
    expect(wrapper.getDOMNode().classList).toContain('test-exit-active');
    expect(wrapper.getDOMNode().classList).toContain('test-exit-to');

    onTransitionEndCalls[0][1]();

    expect(wrapper.getDOMNode().classList).not.toContain('test-exit-active');
    expect(wrapper.getDOMNode().classList).not.toContain('test-exit-to');

    onTransitionEndSpy.mockClear();
    nextFrameSpy.mockClear();

    wrapper.setProps({
      in: true,
    });

    // nextFrame未执行
    expect(wrapper.getDOMNode().classList).toContain('test-enter-from');
    expect(wrapper.getDOMNode().classList).toContain('test-enter-active');

    nextFrameCalls = nextFrameSpy.mock.calls;
    expect(nextFrameCalls.length).toBe(1);

    nextFrameCalls[0][0]();

    onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);

    expect(wrapper.getDOMNode().classList).not.toContain('test-enter-from');
    expect(wrapper.getDOMNode().classList).toContain('test-enter-active');
    expect(wrapper.getDOMNode().classList).toContain('test-enter-to');

    onTransitionEndCalls[0][1]();

    expect(wrapper.getDOMNode().classList).not.toContain('test-enter-active');
    expect(wrapper.getDOMNode().classList).not.toContain('test-enter-to');

    onTransitionEndSpy.mockClear();
    nextFrameSpy.mockClear();
  });

  it('测试timeout调用时机', () => {
    onTransitionEndSpy.mockImplementation((_, cb) => {
      cb();
      return noop;
    });

    jest.useFakeTimers();
    const wrapper = mount(
      <Transition transitionOnFirst={true} in={true} transitionClassName='test' timeout={20}>
        <div />
      </Transition>,
    );

    expect(wrapper.getDOMNode().classList).toContain('test-appear-from');
    expect(wrapper.getDOMNode().classList).toContain('test-appear-active');

    nextFrameSpy.mock.calls[0][0]();

    expect(wrapper.getDOMNode().classList).not.toContain('test-appear-from');
    expect(wrapper.getDOMNode().classList).toContain('test-appear-active');
    expect(wrapper.getDOMNode().classList).toContain('test-appear-to');

    jest.runOnlyPendingTimers();

    expect(wrapper.getDOMNode().classList).not.toContain('test-appear-active');
    expect(wrapper.getDOMNode().classList).not.toContain('test-appear-to');

    nextFrameSpy.mockClear();

    wrapper.setProps({
      in: false,
    });

    expect(wrapper.getDOMNode().classList).toContain('test-exit-from');
    expect(wrapper.getDOMNode().classList).toContain('test-exit-active');

    nextFrameSpy.mock.calls[0][0]();

    expect(wrapper.getDOMNode().classList).not.toContain('test-exit-from');
    expect(wrapper.getDOMNode().classList).toContain('test-exit-active');
    expect(wrapper.getDOMNode().classList).toContain('test-exit-to');

    jest.runOnlyPendingTimers();

    expect(wrapper.getDOMNode().classList).not.toContain('test-exit-active');
    expect(wrapper.getDOMNode().classList).not.toContain('test-exit-to');

    nextFrameSpy.mockClear();

    wrapper.setProps({
      in: true,
    });

    expect(wrapper.getDOMNode().classList).toContain('test-enter-from');
    expect(wrapper.getDOMNode().classList).toContain('test-enter-active');

    nextFrameSpy.mock.calls[0][0]();

    expect(wrapper.getDOMNode().classList).not.toContain('test-enter-from');
    expect(wrapper.getDOMNode().classList).toContain('test-enter-active');
    expect(wrapper.getDOMNode().classList).toContain('test-enter-to');

    jest.runOnlyPendingTimers();

    expect(wrapper.getDOMNode().classList).not.toContain('test-enter-active');
    expect(wrapper.getDOMNode().classList).not.toContain('test-enter-to');
  });
});
