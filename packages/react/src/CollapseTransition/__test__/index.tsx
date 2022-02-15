import { mount } from 'enzyme';
import React from 'react';
import { CollapseTransition } from '@xl-vision/react';

describe('CollapseTransition', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('test render', () => {
    const wrapper = mount(
      <CollapseTransition in={false}>
        <div />
      </CollapseTransition>,
    );

    expect(wrapper.render()).toMatchSnapshot();

    wrapper.setProps({
      in: true,
    });

    jest.runAllTimers();

    expect(wrapper.render()).toMatchSnapshot();

    wrapper.setProps({
      in: false,
    });

    jest.runAllTimers();

    expect(wrapper.render()).toMatchSnapshot();
  });

  it('test horizontal', () => {
    const wrapper = mount(
      <CollapseTransition in={false} horizontal={true}>
        <div />
      </CollapseTransition>,
    );

    expect(wrapper.render()).toMatchSnapshot();

    wrapper.setProps({
      in: true,
    });

    jest.runAllTimers();

    expect(wrapper.render()).toMatchSnapshot();

    wrapper.setProps({
      in: false,
    });

    jest.runAllTimers();

    expect(wrapper.render()).toMatchSnapshot();
  });
});
