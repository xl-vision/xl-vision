/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { mount } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import CSSTransition, { CSSTransitionClasses } from '..';
import wait from '../../../../../test/wait';
import * as TransitionUtils from '../../utils/transition';
import { voidFn } from '../../utils/function';

const classnameMap: CSSTransitionClasses = {
  appear: 'appear',
  appearActive: 'appearActive',
  appearTo: 'appearTo',
  enter: 'enter',
  enterActive: 'enterActive',
  enterTo: 'enterTo',
  leave: 'leave',
  leaveActive: 'leaveActive',
  leaveTo: 'leavtTo',
};

describe('CSSTransition', () => {
  let onTransitionEndSpy: jest.SpyInstance;
  let nextFrameSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useRealTimers();

    onTransitionEndSpy = jest.spyOn(TransitionUtils, 'onTransitionEnd');
    // 保证动画有一定的时间
    onTransitionEndSpy.mockImplementation((_el, done: () => void) => {
      setTimeout(done, 50);
    });

    nextFrameSpy = jest.spyOn(TransitionUtils, 'nextFrame');
    nextFrameSpy.mockImplementation((done: () => void) => {
      const id = setTimeout(done, 50);
      return () => {
        clearTimeout(id);
      };
    });
  });

  it('测试设置transitionOnFirst为true且in为true生命周期', async () => {
    const call = jest.fn();
    const wrapper = mount(
      <CSSTransition
        in={true}
        transitionOnFirst={true}
        beforeAppear={() => {
          call('beforeAppear');
        }}
        transitionClasses={classnameMap}
        appear={(_el, done, isCancelled) => {
          if (!isCancelled()) {
            call(`appear`);
            done();
          }
        }}
        afterAppear={() => {
          call('afterAppear');
        }}
        appearCancelled={() => {
          call('appearCancelled');
        }}
        beforeEnter={() => {
          call('beforeEnter');
        }}
        enter={(_el, done, isCancelled) => {
          if (!isCancelled()) {
            call(`enter`);
            done();
          }
        }}
        afterEnter={() => {
          call('afterEnter');
        }}
        enterCancelled={() => {
          call('enterCancelled');
        }}
        beforeLeave={() => {
          call('beforeLeave');
        }}
        leave={(_el, done, isCancelled) => {
          if (!isCancelled()) {
            call(`leave`);
            done();
          }
        }}
        afterLeave={() => {
          call('afterLeave');
        }}
        leaveCancelled={() => {
          call('leaveCancelled');
        }}
        beforeDisappear={(el) => {
          call('beforeDisappear', el);
        }}
        disappear={(el, done, isCancelled) => {
          if (!isCancelled()) {
            call(`disappear`, el);
            done();
          }
        }}
        afterDisappear={(el) => {
          call('afterDisappear', el);
        }}
        disappearCancelled={(el) => {
          call('disappearCancelled', el);
        }}
      >
        <div />
      </CSSTransition>,
    );
    // 给动画执行时间
    await act(() => wait(100));
    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeAppear');
    expect(call.mock.calls[1][0]).toBe('appear');
    expect(call.mock.calls[2][0]).toBe('afterAppear');
    call.mockClear();

    wrapper.setProps({
      in: false,
    });
    await act(() => wait(100));

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeLeave');
    expect(call.mock.calls[1][0]).toBe('leave');
    expect(call.mock.calls[2][0]).toBe('afterLeave');
    call.mockClear();

    wrapper.setProps({
      in: true,
    });
    await act(() => wait(100));

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeEnter');
    expect(call.mock.calls[1][0]).toBe('enter');
    expect(call.mock.calls[2][0]).toBe('afterEnter');
    call.mockClear();
  });

  it('测试设置transitionOnFirst为true且in为false生命周期', async () => {
    const call = jest.fn();
    const wrapper = mount(
      <CSSTransition
        in={false}
        transitionOnFirst={true}
        transitionClasses={classnameMap}
        beforeAppear={() => {
          call('beforeAppear');
        }}
        appear={(_el, done, isCancelled) => {
          if (!isCancelled()) {
            call(`appear`);
            done();
          }
        }}
        afterAppear={() => {
          call('afterAppear');
        }}
        appearCancelled={() => {
          call('appearCancelled');
        }}
        beforeEnter={() => {
          call('beforeEnter');
        }}
        enter={(_el, done, isCancelled) => {
          if (!isCancelled()) {
            call(`enter`);
            done();
          }
        }}
        afterEnter={() => {
          call('afterEnter');
        }}
        enterCancelled={() => {
          call('enterCancelled');
        }}
        beforeLeave={() => {
          call('beforeLeave');
        }}
        leave={(_el, done, isCancelled) => {
          if (!isCancelled()) {
            call(`leave`);
            done();
          }
        }}
        afterLeave={() => {
          call('afterLeave');
        }}
        leaveCancelled={() => {
          call('leaveCancelled');
        }}
        beforeDisappear={(el) => {
          call('beforeDisappear', el);
        }}
        disappear={(el, done, isCancelled) => {
          if (!isCancelled()) {
            call(`disappear`, el);
            done();
          }
        }}
        afterDisappear={(el) => {
          call('afterDisappear', el);
        }}
        disappearCancelled={(el) => {
          call('disappearCancelled', el);
        }}
      >
        <div />
      </CSSTransition>,
    );

    // 给动画执行时间
    await act(() => wait(100));
    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeDisappear');
    expect(call.mock.calls[1][0]).toBe('disappear');
    expect(call.mock.calls[2][0]).toBe('afterDisappear');
    call.mockClear();

    wrapper.setProps({
      in: true,
    });
    await act(() => wait(100));

    expect(call.mock.calls[0][0]).toBe('beforeEnter');
    expect(call.mock.calls[1][0]).toBe('enter');
    expect(call.mock.calls[2][0]).toBe('afterEnter');
    call.mockClear();

    wrapper.setProps({
      in: false,
    });

    await act(() => wait(100));

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeLeave');
    expect(call.mock.calls[1][0]).toBe('leave');
    expect(call.mock.calls[2][0]).toBe('afterLeave');
    call.mockClear();

    wrapper.setProps({
      in: true,
    });

    await act(() => wait(100));

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeEnter');
    expect(call.mock.calls[1][0]).toBe('enter');
    expect(call.mock.calls[2][0]).toBe('afterEnter');
    call.mockClear();
  });

  it('测试不设置transitionOnFirst且in为false时的生命周期', async () => {
    const call = jest.fn();
    const wrapper = mount(
      <CSSTransition
        in={false}
        transitionClasses={classnameMap}
        beforeAppear={() => {
          call('beforeAppear');
        }}
        appear={(_el, done, isCancelled) => {
          if (!isCancelled()) {
            call(`appear`);
            done();
          }
        }}
        afterAppear={() => {
          call('afterAppear');
        }}
        appearCancelled={() => {
          call('appearCancelled');
        }}
        beforeEnter={() => {
          call('beforeEnter');
        }}
        enter={(_el, done, isCancelled) => {
          if (!isCancelled()) {
            call(`enter`);
            done();
          }
        }}
        afterEnter={() => {
          call('afterEnter');
        }}
        enterCancelled={() => {
          call('enterCancelled');
        }}
        beforeLeave={() => {
          call('beforeLeave');
        }}
        leave={(_el, done, isCancelled) => {
          if (!isCancelled()) {
            call(`leave`);
            done();
          }
        }}
        afterLeave={() => {
          call('afterLeave');
        }}
        leaveCancelled={() => {
          call('leaveCancelled');
        }}
      >
        <div />
      </CSSTransition>,
    );

    // 给动画执行时间
    await act(() => wait(100));

    expect(call.mock.calls.length).toBe(0);

    wrapper.setProps({
      in: true,
    });
    await act(() => wait(100));

    expect(call.mock.calls[0][0]).toBe('beforeEnter');
    expect(call.mock.calls[1][0]).toBe('enter');
    expect(call.mock.calls[2][0]).toBe('afterEnter');
    call.mockClear();

    wrapper.setProps({
      in: false,
    });
    await act(() => wait(100));

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeLeave');
    expect(call.mock.calls[1][0]).toBe('leave');
    expect(call.mock.calls[2][0]).toBe('afterLeave');
    call.mockClear();

    wrapper.setProps({
      in: true,
    });
    await act(() => wait(100));

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeEnter');
    expect(call.mock.calls[1][0]).toBe('enter');
    expect(call.mock.calls[2][0]).toBe('afterEnter');
    call.mockClear();
  });

  it('测试不设置transitionOnFirst且in为true生命周期', async () => {
    const call = jest.fn();
    const wrapper = mount(
      <CSSTransition
        in={true}
        transitionClasses={classnameMap}
        beforeAppear={() => {
          call('beforeAppear');
        }}
        appear={(_el, done, isCancelled) => {
          if (!isCancelled()) {
            call(`appear`);
            done();
          }
        }}
        afterAppear={() => {
          call('afterAppear');
        }}
        appearCancelled={() => {
          call('appearCancelled');
        }}
        beforeEnter={() => {
          call('beforeEnter');
        }}
        enter={(_el, done, isCancelled) => {
          if (!isCancelled()) {
            call(`enter`);
            done();
          }
        }}
        afterEnter={() => {
          call('afterEnter');
        }}
        enterCancelled={() => {
          call('enterCancelled');
        }}
        beforeLeave={() => {
          call('beforeLeave');
        }}
        leave={(_el, done, isCancelled) => {
          if (!isCancelled()) {
            call(`leave`);
            done();
          }
        }}
        afterLeave={() => {
          call('afterLeave');
        }}
        leaveCancelled={() => {
          call('leaveCancelled');
        }}
      >
        <div />
      </CSSTransition>,
    );
    // 给动画执行时间
    await act(() => wait(100));

    expect(call.mock.calls.length).toBe(0);

    wrapper.setProps({
      in: false,
    });
    await act(() => wait(100));

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeLeave');
    expect(call.mock.calls[1][0]).toBe('leave');
    expect(call.mock.calls[2][0]).toBe('afterLeave');
    call.mockClear();

    wrapper.setProps({
      in: true,
    });
    await act(() => wait(100));

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeEnter');
    expect(call.mock.calls[1][0]).toBe('enter');
    expect(call.mock.calls[2][0]).toBe('afterEnter');
    call.mockClear();
  });

  it('测试包含cancelled的生命周期', async () => {
    // 阻止onTransitionEnd完成
    onTransitionEndSpy.mockImplementation(voidFn);
    const call = jest.fn();
    const wrapper = mount(
      <CSSTransition
        in={true}
        transitionOnFirst={true}
        transitionClasses={classnameMap}
        beforeAppear={() => {
          call('beforeAppear');
        }}
        appear={(_el, _done, isCancelled) => {
          if (!isCancelled()) {
            call(`appear`);
            // done()
          }
        }}
        afterAppear={() => {
          call('afterAppear');
        }}
        appearCancelled={() => {
          call('appearCancelled');
        }}
        beforeEnter={() => {
          call('beforeEnter');
        }}
        enter={(_el, _done, isCancelled) => {
          if (!isCancelled()) {
            call(`enter`);
            // done()
          }
        }}
        afterEnter={() => {
          call('afterEnter');
        }}
        enterCancelled={() => {
          call('enterCancelled');
        }}
        beforeLeave={() => {
          call('beforeLeave');
        }}
        leave={(_el, _done, isCancelled) => {
          if (!isCancelled()) {
            call(`leave`);
            // done()
          }
        }}
        afterLeave={() => {
          call('afterLeave');
        }}
        leaveCancelled={() => {
          call('leaveCancelled');
        }}
      >
        <div />
      </CSSTransition>,
    );
    // 给动画执行时间
    await act(() => wait(50));

    expect(call.mock.calls.length).toBe(2);
    expect(call.mock.calls[0][0]).toBe('beforeAppear');
    expect(call.mock.calls[1][0]).toBe('appear');
    call.mockClear();

    wrapper.setProps({
      in: false,
    });
    await act(() => wait(50));

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('appearCancelled');
    expect(call.mock.calls[1][0]).toBe('beforeLeave');
    expect(call.mock.calls[2][0]).toBe('leave');
    call.mockClear();

    wrapper.setProps({
      in: true,
    });
    await act(() => wait(50));

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('leaveCancelled');
    expect(call.mock.calls[1][0]).toBe('beforeEnter');
    expect(call.mock.calls[2][0]).toBe('enter');
    call.mockClear();

    wrapper.setProps({
      in: false,
    });
    await act(() => wait(50));

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('enterCancelled');
    expect(call.mock.calls[1][0]).toBe('beforeLeave');
    expect(call.mock.calls[2][0]).toBe('leave');
    call.mockClear();
  });

  it('测试包含className调用时机', async () => {
    const wrapper = mount(
      <CSSTransition transitionOnFirst={true} in={true} transitionClasses='test'>
        <div />
      </CSSTransition>,
    );
    // nextFrame未执行
    expect(wrapper.getDOMNode().classList).toContain('test-appear');
    expect(wrapper.getDOMNode().classList).toContain('test-appear-active');

    await act(() => wait(50));

    expect(wrapper.getDOMNode().classList).not.toContain('test-appear');
    expect(wrapper.getDOMNode().classList).toContain('test-appear-active');
    expect(wrapper.getDOMNode().classList).toContain('test-appear-to');

    await act(() => wait(50));

    expect(wrapper.getDOMNode().classList).not.toContain('test-appear-active');
    expect(wrapper.getDOMNode().classList).not.toContain('test-appear-to');

    wrapper.setProps({
      in: false,
    });

    // nextFrame未执行
    expect(wrapper.getDOMNode().classList).toContain('test-leave');
    expect(wrapper.getDOMNode().classList).toContain('test-leave-active');

    await act(() => wait(50));

    expect(wrapper.getDOMNode().classList).not.toContain('test-leave');
    expect(wrapper.getDOMNode().classList).toContain('test-leave-active');
    expect(wrapper.getDOMNode().classList).toContain('test-leave-to');

    await act(() => wait(50));

    expect(wrapper.getDOMNode().classList).not.toContain('test-leave-active');
    expect(wrapper.getDOMNode().classList).not.toContain('test-leave-to');

    wrapper.setProps({
      in: true,
    });

    wrapper.update();

    // nextFrame未执行
    expect(wrapper.getDOMNode().classList).toContain('test-enter');
    expect(wrapper.getDOMNode().classList).toContain('test-enter-active');

    await act(() => wait(50));

    expect(wrapper.getDOMNode().classList).not.toContain('test-enter');
    expect(wrapper.getDOMNode().classList).toContain('test-enter-active');
    expect(wrapper.getDOMNode().classList).toContain('test-enter-to');

    await act(() => wait(50));

    expect(wrapper.getDOMNode().classList).not.toContain('test-enter-active');
    expect(wrapper.getDOMNode().classList).not.toContain('test-enter-to');
  });

  it('测试timeout调用时机', async () => {
    const wrapper = mount(
      <CSSTransition transitionOnFirst={true} in={true} transitionClasses='test' timeout={10}>
        <div />
      </CSSTransition>,
    );
    // nextFrame未执行
    expect(wrapper.getDOMNode().classList).toContain('test-appear');
    expect(wrapper.getDOMNode().classList).toContain('test-appear-active');

    await act(() => wait(50));
    wrapper.update();

    expect(wrapper.getDOMNode().classList).not.toContain('test-appear');
    expect(wrapper.getDOMNode().classList).toContain('test-appear-active');
    expect(wrapper.getDOMNode().classList).toContain('test-appear-to');

    await act(() => wait(50));

    expect(wrapper.getDOMNode().classList).not.toContain('test-appear-active');
    expect(wrapper.getDOMNode().classList).not.toContain('test-appear-to');

    wrapper.setProps({
      in: false,
    });

    // nextFrame未执行
    expect(wrapper.getDOMNode().classList).toContain('test-leave');
    expect(wrapper.getDOMNode().classList).toContain('test-leave-active');

    await act(() => wait(50));

    expect(wrapper.getDOMNode().classList).not.toContain('test-leave');
    expect(wrapper.getDOMNode().classList).toContain('test-leave-active');
    expect(wrapper.getDOMNode().classList).toContain('test-leave-to');

    await act(() => wait(50));

    expect(wrapper.getDOMNode().classList).not.toContain('test-leave-active');
    expect(wrapper.getDOMNode().classList).not.toContain('test-leave-to');

    wrapper.setProps({
      in: true,
    });

    wrapper.update();

    // nextFrame未执行
    expect(wrapper.getDOMNode().classList).toContain('test-enter');
    expect(wrapper.getDOMNode().classList).toContain('test-enter-active');

    await act(() => wait(50));

    expect(wrapper.getDOMNode().classList).not.toContain('test-enter');
    expect(wrapper.getDOMNode().classList).toContain('test-enter-active');
    expect(wrapper.getDOMNode().classList).toContain('test-enter-to');

    await act(() => wait(50));

    expect(wrapper.getDOMNode().classList).not.toContain('test-enter-active');
    expect(wrapper.getDOMNode().classList).not.toContain('test-enter-to');
  });
});
