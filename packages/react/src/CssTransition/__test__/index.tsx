/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { mount } from 'enzyme';
import React from 'react';
import { CssTransition, CssTransitionClasses } from '@xl-vision/react';
import { noop } from '@xl-vision/utils';
import * as TransitionUtils from '../../utils/transition';
import * as nextFrame from '../../utils/nextFrame';

const classnameMap: CssTransitionClasses = {
  appearFrom: 'appearFrom',
  appearActive: 'appearActive',
  appearTo: 'appearTo',
  enterFrom: 'enterFrom',
  enterActive: 'enterActive',
  enterTo: 'enterTo',
  leaveFrom: 'leaveFrom',
  leaveActive: 'leaveActive',
  leaveTo: 'leavtTo',
  disappearFrom: 'disappearFrom',
  disappearActive: 'disappearActive',
  disappearTo: 'disappearTo',
};

describe('CssTransition', () => {
  const onTransitionEndSpy = jest.spyOn(TransitionUtils, 'onTransitionEnd').mockImplementation();
  const nextFrameSpy = jest.spyOn(nextFrame, 'default').mockImplementation();
  const call = jest.fn();

  afterEach(() => {
    onTransitionEndSpy.mockClear();
    nextFrameSpy.mockClear();
    call.mockClear();
  });

  it('测试设置transitionOnFirst为true且in为true生命周期', () => {
    const wrapper = mount(
      <CssTransition
        in={true}
        transitionOnFirst={true}
        beforeEnter={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'beforeAppear' : 'beforeEnter');
        }}
        enter={(_el, _done, isCancelled, transitionOnFirst) => {
          if (!isCancelled()) {
            call(transitionOnFirst ? 'appear' : 'enter');
          }
        }}
        afterEnter={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'afterAppear' : 'afterEnter');
        }}
        enterCancelled={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'appearCancelled' : 'enterCancelled');
        }}
        beforeLeave={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'beforeDisappear' : 'beforeLeave');
        }}
        leave={(_el, _done, isCancelled, transitionOnFirst) => {
          if (!isCancelled()) {
            call(transitionOnFirst ? 'disappear' : 'leave');
          }
        }}
        afterLeave={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'afterDisappear' : 'afterLeave');
        }}
        leaveCancelled={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'disappearCancelled' : 'leaveCancelled');
        }}
      >
        <div />
      </CssTransition>,
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
    expect(call.mock.calls[0][0]).toBe('beforeLeave');
    expect(call.mock.calls[1][0]).toBe('leave');
    expect(call.mock.calls[2][0]).toBe('afterLeave');
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
      <CssTransition
        in={false}
        transitionOnFirst={true}
        transitionClasses={classnameMap}
        beforeEnter={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'beforeAppear' : 'beforeEnter');
        }}
        enter={(_el, _done, isCancelled, transitionOnFirst) => {
          if (!isCancelled()) {
            call(transitionOnFirst ? 'appear' : 'enter');
          }
        }}
        afterEnter={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'afterAppear' : 'afterEnter');
        }}
        enterCancelled={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'appearCancelled' : 'enterCancelled');
        }}
        beforeLeave={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'beforeDisappear' : 'beforeLeave');
        }}
        leave={(_el, _done, isCancelled, transitionOnFirst) => {
          if (!isCancelled()) {
            call(transitionOnFirst ? 'disappear' : 'leave');
          }
        }}
        afterLeave={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'afterDisappear' : 'afterLeave');
        }}
        leaveCancelled={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'disappearCancelled' : 'leaveCancelled');
        }}
      >
        <div />
      </CssTransition>,
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
    expect(call.mock.calls[0][0]).toBe('beforeLeave');
    expect(call.mock.calls[1][0]).toBe('leave');
    expect(call.mock.calls[2][0]).toBe('afterLeave');

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
      <CssTransition
        in={false}
        transitionClasses={classnameMap}
        beforeEnter={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'beforeAppear' : 'beforeEnter');
        }}
        enter={(_el, _done, isCancelled, transitionOnFirst) => {
          if (!isCancelled()) {
            call(transitionOnFirst ? 'appear' : 'enter');
          }
        }}
        afterEnter={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'afterAppear' : 'afterEnter');
        }}
        enterCancelled={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'appearCancelled' : 'enterCancelled');
        }}
        beforeLeave={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'beforeDisappear' : 'beforeLeave');
        }}
        leave={(_el, _done, isCancelled, transitionOnFirst) => {
          if (!isCancelled()) {
            call(transitionOnFirst ? 'disappear' : 'leave');
          }
        }}
        afterLeave={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'afterDisappear' : 'afterLeave');
        }}
        leaveCancelled={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'disappearCancelled' : 'leaveCancelled');
        }}
      >
        <div />
      </CssTransition>,
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
    expect(call.mock.calls[0][0]).toBe('beforeLeave');
    expect(call.mock.calls[1][0]).toBe('leave');
    expect(call.mock.calls[2][0]).toBe('afterLeave');

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
      <CssTransition
        in={true}
        transitionClasses={classnameMap}
        beforeEnter={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'beforeAppear' : 'beforeEnter');
        }}
        enter={(_el, _done, isCancelled, transitionOnFirst) => {
          if (!isCancelled()) {
            call(transitionOnFirst ? 'appear' : 'enter');
          }
        }}
        afterEnter={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'afterAppear' : 'afterEnter');
        }}
        enterCancelled={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'appearCancelled' : 'enterCancelled');
        }}
        beforeLeave={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'beforeDisappear' : 'beforeLeave');
        }}
        leave={(_el, _done, isCancelled, transitionOnFirst) => {
          if (!isCancelled()) {
            call(transitionOnFirst ? 'disappear' : 'leave');
          }
        }}
        afterLeave={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'afterDisappear' : 'afterLeave');
        }}
        leaveCancelled={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'disappearCancelled' : 'leaveCancelled');
        }}
      >
        <div />
      </CssTransition>,
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
    expect(call.mock.calls[0][0]).toBe('beforeLeave');
    expect(call.mock.calls[1][0]).toBe('leave');
    expect(call.mock.calls[2][0]).toBe('afterLeave');
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
      <CssTransition
        in={true}
        transitionOnFirst={true}
        transitionClasses={classnameMap}
        beforeEnter={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'beforeAppear' : 'beforeEnter');
        }}
        enter={(_el, _done, isCancelled, transitionOnFirst) => {
          if (!isCancelled()) {
            call(transitionOnFirst ? 'appear' : 'enter');
          }
        }}
        afterEnter={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'afterAppear' : 'afterEnter');
        }}
        enterCancelled={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'appearCancelled' : 'enterCancelled');
        }}
        beforeLeave={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'beforeDisappear' : 'beforeLeave');
        }}
        leave={(_el, _done, isCancelled, transitionOnFirst) => {
          if (!isCancelled()) {
            call(transitionOnFirst ? 'disappear' : 'leave');
          }
        }}
        afterLeave={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'afterDisappear' : 'afterLeave');
        }}
        leaveCancelled={(_el, transitionOnFirst) => {
          call(transitionOnFirst ? 'disappearCancelled' : 'leaveCancelled');
        }}
      >
        <div />
      </CssTransition>,
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
    expect(call.mock.calls[1][0]).toBe('beforeLeave');
    expect(call.mock.calls[2][0]).toBe('leave');

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
    expect(call.mock.calls[0][0]).toBe('leaveCancelled');
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
    expect(call.mock.calls[1][0]).toBe('beforeLeave');
    expect(call.mock.calls[2][0]).toBe('leave');
    expect(call.mock.calls[3][0]).toBe('afterLeave');
  });

  it('测试包含className调用时机', () => {
    const wrapper = mount(
      <CssTransition transitionOnFirst={true} in={true} transitionClasses='test'>
        <div />
      </CssTransition>,
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
    expect(wrapper.getDOMNode().classList).toContain('test-leave-from');
    expect(wrapper.getDOMNode().classList).toContain('test-leave-active');

    nextFrameCalls = nextFrameSpy.mock.calls;
    expect(nextFrameCalls.length).toBe(1);

    nextFrameCalls[0][0]();

    onTransitionEndCalls = onTransitionEndSpy.mock.calls;
    expect(onTransitionEndCalls.length).toBe(1);

    expect(wrapper.getDOMNode().classList).not.toContain('test-leave-from');
    expect(wrapper.getDOMNode().classList).toContain('test-leave-active');
    expect(wrapper.getDOMNode().classList).toContain('test-leave-to');

    onTransitionEndCalls[0][1]();

    expect(wrapper.getDOMNode().classList).not.toContain('test-leave-active');
    expect(wrapper.getDOMNode().classList).not.toContain('test-leave-to');

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
      <CssTransition transitionOnFirst={true} in={true} transitionClasses='test' timeout={20}>
        <div />
      </CssTransition>,
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

    expect(wrapper.getDOMNode().classList).toContain('test-leave-from');
    expect(wrapper.getDOMNode().classList).toContain('test-leave-active');

    nextFrameSpy.mock.calls[0][0]();

    expect(wrapper.getDOMNode().classList).not.toContain('test-leave-from');
    expect(wrapper.getDOMNode().classList).toContain('test-leave-active');
    expect(wrapper.getDOMNode().classList).toContain('test-leave-to');

    jest.runOnlyPendingTimers();

    expect(wrapper.getDOMNode().classList).not.toContain('test-leave-active');
    expect(wrapper.getDOMNode().classList).not.toContain('test-leave-to');

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
