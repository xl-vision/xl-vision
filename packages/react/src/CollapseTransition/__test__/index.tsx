import { mount } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import wait from '../../../../../test/wait';
import CollapseTransition from '..';
import * as TransitionUtils from '../../utils/transition';

describe('CollapseTransition', () => {
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

  it('test render', async () => {
    const wrapper = mount(
      <CollapseTransition in={false}>
        <div />
      </CollapseTransition>,
    );

    expect(wrapper.render()).toMatchSnapshot();

    wrapper.setProps({
      in: true,
    });

    wrapper.update();

    await act(() => wait(100));

    expect(wrapper.render()).toMatchSnapshot();

    wrapper.setProps({
      in: false,
    });

    wrapper.update();

    await act(() => wait(100));

    expect(wrapper.render()).toMatchSnapshot();
  });

  it('test horizontal', async () => {
    const wrapper = mount(
      <CollapseTransition in={false} horizontal={true}>
        <div />
      </CollapseTransition>,
    );

    expect(wrapper.render()).toMatchSnapshot();

    wrapper.setProps({
      in: true,
    });

    wrapper.update();

    await act(() => wait(100));

    expect(wrapper.render()).toMatchSnapshot();

    wrapper.setProps({
      in: false,
    });

    wrapper.update();

    await act(() => wait(100));

    expect(wrapper.render()).toMatchSnapshot();
  });
});
