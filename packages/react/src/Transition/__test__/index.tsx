/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { mount } from 'enzyme';
import React from 'react';
import Transition from '..';

describe('Transition', () => {
  it('测试transitionOnFirst为true，且in为true时的生命周期', () => {
    const call = jest.fn();
    const wrapper = mount(
      <Transition
        in={true}
        transitionOnFirst={true}
        beforeAppear={(el) => {
          call('beforeAppear', el);
        }}
        appear={(el, done, isCancelled) => {
          if (!isCancelled()) {
            call(`appear`, el);
            done();
          }
        }}
        afterAppear={(el) => {
          call('afterAppear', el);
        }}
        appearCancelled={(el) => {
          call('appearCancelled', el);
        }}
        beforeEnter={(el) => {
          call('beforeEnter', el);
        }}
        enter={(el, done, isCancelled) => {
          if (!isCancelled()) {
            call(`enter`, el);
            done();
          }
        }}
        afterEnter={(el) => {
          call('afterEnter', el);
        }}
        enterCancelled={(el) => {
          call('enterCancelled', el);
        }}
        beforeLeave={(el) => {
          call('beforeLeave', el);
        }}
        leave={(el, done, isCancelled) => {
          if (!isCancelled()) {
            call(`leave`, el);
            done();
          }
        }}
        afterLeave={(el) => {
          call('afterLeave', el);
        }}
        leaveCancelled={(el) => {
          call('leaveCancelled', el);
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
      </Transition>,
    );

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeAppear');
    expect(call.mock.calls[0][1]).toBeInstanceOf(HTMLDivElement);
    expect(call.mock.calls[1][0]).toBe('appear');
    expect(call.mock.calls[1][1]).toBeInstanceOf(HTMLDivElement);
    expect(call.mock.calls[2][0]).toBe('afterAppear');
    expect(call.mock.calls[2][1]).toBeInstanceOf(HTMLDivElement);
    call.mockClear();

    wrapper.setProps({
      in: false,
    });
    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeLeave');
    expect(call.mock.calls[0][1]).toBeInstanceOf(HTMLDivElement);
    expect(call.mock.calls[1][0]).toBe('leave');
    expect(call.mock.calls[1][1]).toBeInstanceOf(HTMLDivElement);
    expect(call.mock.calls[2][0]).toBe('afterLeave');
    expect(call.mock.calls[2][1]).toBeInstanceOf(HTMLDivElement);
    call.mockClear();

    wrapper.setProps({
      in: true,
    });
    wrapper.update();
    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeEnter');
    expect(call.mock.calls[0][1]).toBeInstanceOf(HTMLDivElement);
    expect(call.mock.calls[1][0]).toBe('enter');
    expect(call.mock.calls[1][1]).toBeInstanceOf(HTMLDivElement);
    expect(call.mock.calls[2][0]).toBe('afterEnter');
    expect(call.mock.calls[2][1]).toBeInstanceOf(HTMLDivElement);
    call.mockClear();
  });

  it('测试transitionOnFirst为true，且in为false时的生命周期', () => {
    const call = jest.fn();
    const wrapper = mount(
      <Transition
        in={false}
        transitionOnFirst={true}
        beforeAppear={(el) => {
          call('beforeAppear', el);
        }}
        appear={(el, done, isCancelled) => {
          if (!isCancelled()) {
            call(`appear`, el);
            done();
          }
        }}
        afterAppear={(el) => {
          call('afterAppear', el);
        }}
        appearCancelled={(el) => {
          call('appearCancelled', el);
        }}
        beforeEnter={(el) => {
          call('beforeEnter', el);
        }}
        enter={(el, done, isCancelled) => {
          if (!isCancelled()) {
            call(`enter`, el);
            done();
          }
        }}
        afterEnter={(el) => {
          call('afterEnter', el);
        }}
        enterCancelled={(el) => {
          call('enterCancelled', el);
        }}
        beforeLeave={(el) => {
          call('beforeLeave', el);
        }}
        leave={(el, done, isCancelled) => {
          if (!isCancelled()) {
            call(`leave`, el);
            done();
          }
        }}
        afterLeave={(el) => {
          call('afterLeave', el);
        }}
        leaveCancelled={(el) => {
          call('leaveCancelled', el);
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
      </Transition>,
    );

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeDisappear');
    expect(call.mock.calls[0][1]).toBeInstanceOf(HTMLDivElement);
    expect(call.mock.calls[1][0]).toBe('disappear');
    expect(call.mock.calls[1][1]).toBeInstanceOf(HTMLDivElement);
    expect(call.mock.calls[2][0]).toBe('afterDisappear');
    expect(call.mock.calls[2][1]).toBeInstanceOf(HTMLDivElement);
    call.mockClear();

    wrapper.setProps({
      in: true,
    });
    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeEnter');
    expect(call.mock.calls[0][1]).toBeInstanceOf(HTMLDivElement);
    expect(call.mock.calls[1][0]).toBe('enter');
    expect(call.mock.calls[1][1]).toBeInstanceOf(HTMLDivElement);
    expect(call.mock.calls[2][0]).toBe('afterEnter');
    expect(call.mock.calls[2][1]).toBeInstanceOf(HTMLDivElement);
    call.mockClear();

    wrapper.setProps({
      in: false,
    });

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeLeave');
    expect(call.mock.calls[0][1]).toBeInstanceOf(HTMLDivElement);
    expect(call.mock.calls[1][0]).toBe('leave');
    expect(call.mock.calls[1][1]).toBeInstanceOf(HTMLDivElement);
    expect(call.mock.calls[2][0]).toBe('afterLeave');
    expect(call.mock.calls[2][1]).toBeInstanceOf(HTMLDivElement);
    call.mockClear();

    wrapper.setProps({
      in: true,
    });
    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeEnter');
    expect(call.mock.calls[0][1]).toBeInstanceOf(HTMLDivElement);
    expect(call.mock.calls[1][0]).toBe('enter');
    expect(call.mock.calls[1][1]).toBeInstanceOf(HTMLDivElement);
    expect(call.mock.calls[2][0]).toBe('afterEnter');
    expect(call.mock.calls[2][1]).toBeInstanceOf(HTMLDivElement);
    call.mockClear();
  });

  it('测试未设置transitionOnFirst且in为false时生命周期', () => {
    const call = jest.fn();
    const wrapper = mount(
      <Transition
        in={false}
        beforeAppear={(el) => {
          call('beforeAppear', el);
        }}
        appear={(el, done, isCancelled) => {
          if (!isCancelled()) {
            call(`appear`, el);
            done();
          }
        }}
        afterAppear={(el) => {
          call('afterAppear', el);
        }}
        appearCancelled={(el) => {
          call('appearCancelled', el);
        }}
        beforeEnter={(el) => {
          call('beforeEnter', el);
        }}
        enter={(el, done, isCancelled) => {
          if (!isCancelled()) {
            call(`enter`, el);
            done();
          }
        }}
        afterEnter={(el) => {
          call('afterEnter', el);
        }}
        enterCancelled={(el) => {
          call('enterCancelled', el);
        }}
        beforeLeave={(el) => {
          call('beforeLeave', el);
        }}
        leave={(el, done, isCancelled) => {
          if (!isCancelled()) {
            call(`leave`, el);
            done();
          }
        }}
        afterLeave={(el) => {
          call('afterLeave', el);
        }}
        leaveCancelled={(el) => {
          call('leaveCancelled', el);
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
      </Transition>,
    );

    expect(call.mock.calls.length).toBe(0);

    wrapper.setProps({
      in: true,
    });
    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeEnter');
    expect(call.mock.calls[0][1]).toBeInstanceOf(HTMLDivElement);
    expect(call.mock.calls[1][0]).toBe('enter');
    expect(call.mock.calls[1][1]).toBeInstanceOf(HTMLDivElement);
    expect(call.mock.calls[2][0]).toBe('afterEnter');
    expect(call.mock.calls[2][1]).toBeInstanceOf(HTMLDivElement);
    call.mockClear();

    wrapper.setProps({
      in: false,
    });

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeLeave');
    expect(call.mock.calls[0][1]).toBeInstanceOf(HTMLDivElement);
    expect(call.mock.calls[1][0]).toBe('leave');
    expect(call.mock.calls[1][1]).toBeInstanceOf(HTMLDivElement);
    expect(call.mock.calls[2][0]).toBe('afterLeave');
    expect(call.mock.calls[2][1]).toBeInstanceOf(HTMLDivElement);
    call.mockClear();

    wrapper.setProps({
      in: true,
    });
    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeEnter');
    expect(call.mock.calls[0][1]).toBeInstanceOf(HTMLDivElement);
    expect(call.mock.calls[1][0]).toBe('enter');
    expect(call.mock.calls[1][1]).toBeInstanceOf(HTMLDivElement);
    expect(call.mock.calls[2][0]).toBe('afterEnter');
    expect(call.mock.calls[2][1]).toBeInstanceOf(HTMLDivElement);
    call.mockClear();
  });
  it('测试未设置transitionOnFirst且in为true时的生命周期', () => {
    const call = jest.fn();
    const wrapper = mount(
      <Transition
        in={true}
        beforeAppear={(el) => {
          call('beforeAppear', el);
        }}
        appear={(el, done, isCancelled) => {
          if (!isCancelled()) {
            call(`appear`, el);
            done();
          }
        }}
        afterAppear={(el) => {
          call('afterAppear', el);
        }}
        appearCancelled={(el) => {
          call('appearCancelled', el);
        }}
        beforeEnter={(el) => {
          call('beforeEnter', el);
        }}
        enter={(el, done, isCancelled) => {
          if (!isCancelled()) {
            call(`enter`, el);
            done();
          }
        }}
        afterEnter={(el) => {
          call('afterEnter', el);
        }}
        enterCancelled={(el) => {
          call('enterCancelled', el);
        }}
        beforeLeave={(el) => {
          call('beforeLeave', el);
        }}
        leave={(el, done, isCancelled) => {
          if (!isCancelled()) {
            call(`leave`, el);
            done();
          }
        }}
        afterLeave={(el) => {
          call('afterLeave', el);
        }}
        leaveCancelled={(el) => {
          call('leaveCancelled', el);
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
      </Transition>,
    );

    expect(call.mock.calls.length).toBe(0);

    wrapper.setProps({
      in: false,
    });
    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeLeave');
    expect(call.mock.calls[0][1]).toBeInstanceOf(HTMLDivElement);
    expect(call.mock.calls[1][0]).toBe('leave');
    expect(call.mock.calls[1][1]).toBeInstanceOf(HTMLDivElement);
    expect(call.mock.calls[2][0]).toBe('afterLeave');
    expect(call.mock.calls[2][1]).toBeInstanceOf(HTMLDivElement);
    call.mockClear();

    wrapper.setProps({
      in: true,
    });
    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('beforeEnter');
    expect(call.mock.calls[0][1]).toBeInstanceOf(HTMLDivElement);
    expect(call.mock.calls[1][0]).toBe('enter');
    expect(call.mock.calls[1][1]).toBeInstanceOf(HTMLDivElement);
    expect(call.mock.calls[2][0]).toBe('afterEnter');
    expect(call.mock.calls[2][1]).toBeInstanceOf(HTMLDivElement);
    call.mockClear();
  });
  it('测试transitionOnFirst为true,in为true时cancelled生命周期', () => {
    const call = jest.fn();
    const wrapper = mount(
      <Transition
        transitionOnFirst={true}
        in={true}
        beforeAppear={(el) => {
          call('beforeAppear', el);
        }}
        appear={(el, _done, isCancelled) => {
          if (!isCancelled()) {
            call(`appear`, el);
            // done()
          }
        }}
        afterAppear={(el) => {
          call('afterAppear', el);
        }}
        appearCancelled={(el) => {
          call('appearCancelled', el);
        }}
        beforeEnter={(el) => {
          call('beforeEnter', el);
        }}
        enter={(el, _done, isCancelled) => {
          if (!isCancelled()) {
            call(`enter`, el);
            // done()
          }
        }}
        afterEnter={(el) => {
          call('afterEnter', el);
        }}
        enterCancelled={(el) => {
          call('enterCancelled', el);
        }}
        beforeLeave={(el) => {
          call('beforeLeave', el);
        }}
        leave={(el, _done, isCancelled) => {
          if (!isCancelled()) {
            call(`leave`, el);
            // done()
          }
        }}
        afterLeave={(el) => {
          call('afterLeave', el);
        }}
        leaveCancelled={(el) => {
          call('leaveCancelled', el);
        }}
        beforeDisappear={(el) => {
          call('beforeDisappear', el);
        }}
        disappear={(el, _done, isCancelled) => {
          if (!isCancelled()) {
            call(`disappear`, el);
            // done()
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
      </Transition>,
    );

    expect(call.mock.calls.length).toBe(2);

    expect(call.mock.calls[0][0]).toBe('beforeAppear');
    expect(call.mock.calls[0][1]).toBeInstanceOf(HTMLDivElement);
    expect(call.mock.calls[1][0]).toBe('appear');
    expect(call.mock.calls[1][1]).toBeInstanceOf(HTMLDivElement);
    call.mockClear();

    wrapper.setProps({
      in: false,
    });

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('appearCancelled');
    expect(call.mock.calls[0][1]).toBeInstanceOf(HTMLDivElement);
    expect(call.mock.calls[1][0]).toBe('beforeLeave');
    expect(call.mock.calls[1][1]).toBeInstanceOf(HTMLDivElement);
    expect(call.mock.calls[2][0]).toBe('leave');
    expect(call.mock.calls[2][1]).toBeInstanceOf(HTMLDivElement);
    call.mockClear();

    wrapper.setProps({
      in: true,
    });

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('leaveCancelled');
    expect(call.mock.calls[0][1]).toBeInstanceOf(HTMLDivElement);
    expect(call.mock.calls[1][0]).toBe('beforeEnter');
    expect(call.mock.calls[1][1]).toBeInstanceOf(HTMLDivElement);
    expect(call.mock.calls[2][0]).toBe('enter');
    expect(call.mock.calls[2][1]).toBeInstanceOf(HTMLDivElement);
    call.mockClear();

    wrapper.setProps({
      in: false,
    });

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('enterCancelled');
    expect(call.mock.calls[0][1]).toBeInstanceOf(HTMLDivElement);
    expect(call.mock.calls[1][0]).toBe('beforeLeave');
    expect(call.mock.calls[1][1]).toBeInstanceOf(HTMLDivElement);
    expect(call.mock.calls[2][0]).toBe('leave');
    expect(call.mock.calls[2][1]).toBeInstanceOf(HTMLDivElement);
    call.mockClear();
  });

  it('测试transitionOnFirst为true,in为false时cancelled生命周期', () => {
    const call = jest.fn();
    const wrapper = mount(
      <Transition
        transitionOnFirst={true}
        in={false}
        beforeAppear={(el) => {
          call('beforeAppear', el);
        }}
        appear={(el, _done, isCancelled) => {
          if (!isCancelled()) {
            call(`appear`, el);
            // done()
          }
        }}
        afterAppear={(el) => {
          call('afterAppear', el);
        }}
        appearCancelled={(el) => {
          call('appearCancelled', el);
        }}
        beforeEnter={(el) => {
          call('beforeEnter', el);
        }}
        enter={(el, _done, isCancelled) => {
          if (!isCancelled()) {
            call(`enter`, el);
            // done()
          }
        }}
        afterEnter={(el) => {
          call('afterEnter', el);
        }}
        enterCancelled={(el) => {
          call('enterCancelled', el);
        }}
        beforeLeave={(el) => {
          call('beforeLeave', el);
        }}
        leave={(el, _done, isCancelled) => {
          if (!isCancelled()) {
            call(`leave`, el);
            // done()
          }
        }}
        afterLeave={(el) => {
          call('afterLeave', el);
        }}
        leaveCancelled={(el) => {
          call('leaveCancelled', el);
        }}
        beforeDisappear={(el) => {
          call('beforeDisappear', el);
        }}
        disappear={(el, _done, isCancelled) => {
          if (!isCancelled()) {
            call(`disappear`, el);
            // done()
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
      </Transition>,
    );

    expect(call.mock.calls.length).toBe(2);

    expect(call.mock.calls[0][0]).toBe('beforeDisappear');
    expect(call.mock.calls[0][1]).toBeInstanceOf(HTMLDivElement);
    expect(call.mock.calls[1][0]).toBe('disappear');
    expect(call.mock.calls[1][1]).toBeInstanceOf(HTMLDivElement);
    call.mockClear();

    wrapper.setProps({
      in: true,
    });

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('disappearCancelled');
    expect(call.mock.calls[0][1]).toBeInstanceOf(HTMLDivElement);
    expect(call.mock.calls[1][0]).toBe('beforeEnter');
    expect(call.mock.calls[1][1]).toBeInstanceOf(HTMLDivElement);
    expect(call.mock.calls[2][0]).toBe('enter');
    expect(call.mock.calls[2][1]).toBeInstanceOf(HTMLDivElement);
    call.mockClear();

    wrapper.setProps({
      in: false,
    });

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('enterCancelled');
    expect(call.mock.calls[0][1]).toBeInstanceOf(HTMLDivElement);
    expect(call.mock.calls[1][0]).toBe('beforeLeave');
    expect(call.mock.calls[1][1]).toBeInstanceOf(HTMLDivElement);
    expect(call.mock.calls[2][0]).toBe('leave');
    expect(call.mock.calls[2][1]).toBeInstanceOf(HTMLDivElement);
    call.mockClear();

    wrapper.setProps({
      in: true,
    });

    expect(call.mock.calls.length).toBe(3);
    expect(call.mock.calls[0][0]).toBe('leaveCancelled');
    expect(call.mock.calls[0][1]).toBeInstanceOf(HTMLDivElement);
    expect(call.mock.calls[1][0]).toBe('beforeEnter');
    expect(call.mock.calls[1][1]).toBeInstanceOf(HTMLDivElement);
    expect(call.mock.calls[2][0]).toBe('enter');
    expect(call.mock.calls[2][1]).toBeInstanceOf(HTMLDivElement);
    call.mockClear();
  });

  it('测试mountOnEnter', () => {
    const wrapper = mount(
      <Transition in={false} mountOnEnter={true}>
        <div />
      </Transition>,
    );

    expect(wrapper.getDOMNode()).toBeNull();

    wrapper.setProps({
      in: true,
    });

    wrapper.update();

    expect(wrapper.getDOMNode()).not.toBeNull();

    wrapper.setProps({
      in: false,
    });
    wrapper.update();

    expect(wrapper.getDOMNode()).not.toBeNull();
  });

  it('测试unmountOnLeave', () => {
    const wrapper = mount(
      <Transition in={false} unmountOnLeave={true}>
        <div />
      </Transition>,
    );

    expect(wrapper.getDOMNode()).not.toBeNull();

    wrapper.setProps({
      in: true,
    });

    wrapper.update();

    expect(wrapper.getDOMNode()).not.toBeNull();

    wrapper.setProps({
      in: false,
    });
    wrapper.update();

    expect(wrapper.getDOMNode()).toBeNull();
  });
});
