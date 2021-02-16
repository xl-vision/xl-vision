import { mount } from 'enzyme';
import React from 'react';
import CollapseTransition from '..';

describe('CollapseTransition', () => {
  it('基本使用', () => {
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

    expect(wrapper.render()).toMatchSnapshot();
  });

  it('测试horizontal', () => {
    const wrapper = mount(
      <CollapseTransition horizontal={true} in={false}>
        <div />
      </CollapseTransition>,
    );

    expect(wrapper.render()).toMatchSnapshot();

    wrapper.setProps({
      in: true,
    });

    wrapper.update();

    expect(wrapper.render()).toMatchSnapshot();
  });
});
