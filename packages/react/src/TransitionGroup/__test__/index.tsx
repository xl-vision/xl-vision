/* eslint-disable @typescript-eslint/no-unsafe-return */
import { mount } from 'enzyme';
import React from 'react';
import { noop } from '@xl-vision/utils';
import * as utils from '@xl-vision/utils';
import TransitionGroup from '..';

describe('TransitionGroup', () => {
  it('测试顺序是否正确', () => {
    const prevArr = [1, 2, 3, 4, 5];
    const nextArr = [2, 1, 4, 6, 5];
    const expectArr = [2, 1, 3, 4, 6, 5];
    const Comp = (props: { arr: Array<number> }) => {
      const { arr } = props;
      const children = arr.map((it) => <div key={it}>{it}</div>);
      return <TransitionGroup transitionClassName='demo'>{children}</TransitionGroup>;
    };
    const wrapper = mount(<Comp arr={prevArr} />);
    expect(wrapper.text()).toBe(prevArr.map((it) => it.toString()).reduce((a, b) => a + b));
    wrapper.setProps({ arr: nextArr });
    wrapper.update();

    expect(wrapper.text()).toBe(expectArr.map((it) => it.toString()).reduce((a, b) => a + b));
  });

  it('test hooks', () => {
    const nextFrameSpy = jest.spyOn(utils, 'nextFrame');
    nextFrameSpy.mockImplementation((fn: () => void) => {
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
          onEntering={() => fn('enter')}
          onEntered={() => fn('afterEnter')}
          onExit={() => fn('beforeExit')}
          onExiting={() => fn('exit')}
          onExited={() => fn('afterExit')}
        >
          {children}
        </TransitionGroup>
      );
    };
    const wrapper = mount(<Comp arr={prevArr} />);
    expect(fn.mock.calls.length).toBe(0);
    wrapper.setProps({ arr: nextArr });
    expect(fn.mock.calls.length).toBe(6);
    wrapper.setProps({ arr: nextArr });
    expect(fn.mock.calls.length).toBe(6);

    wrapper.setProps({ arr: nextArr2 });
    expect(fn.mock.calls.length).toBe(6 * 2);
  });
});
