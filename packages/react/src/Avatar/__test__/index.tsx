/* eslint-disable react/jsx-handler-names */
import React from 'react';
import { mount } from 'enzyme';
import Avatar from '..';

describe('Avatar', () => {
  it('Render string', () => {
    const wrapper = mount(<Avatar>TestString</Avatar>);
    const render = wrapper.render();
    const children = render.find('.xl-avatar__inner');
    expect(children.text()).toBe('TestString');
    wrapper.unmount();
  });

  it('Render fallback string', () => {
    const wrapper = mount(<Avatar src='http://error.url'>Fallback</Avatar>);

    wrapper.find('img').simulate('error');

    expect(wrapper.find('img').length).toBe(0);

    const children = wrapper.find('span.xl-avatar__inner');
    expect(children.text()).toBe('Fallback');
    wrapper.unmount();
  });

  it('Custom onError function', () => {
    const fn = jest.fn();
    fn.mockReturnValue(false);
    const wrapper = mount(
      <Avatar src='http://error.url' onError={fn}>
        Fallback
      </Avatar>,
    );

    wrapper.find('img').simulate('error');

    expect(wrapper.find('img').length).toBe(1);
    expect(wrapper.find('span.xl-avatar__inner').length).toBe(0);
    wrapper.unmount();
  });
});

describe('AvatarGroup', () => {
  it('render size', () => {
    const wrapper = mount(
      <Avatar.Group size='large'>
        <Avatar>TestString</Avatar>
        <Avatar>TestString</Avatar>
      </Avatar.Group>,
    );

    expect(wrapper.find('span.xl-avatar--size-large').length).toBe(2);
  });

  it('render shape', () => {
    const wrapper = mount(
      <Avatar.Group shape='square'>
        <Avatar>TestString</Avatar>
        <Avatar>TestString</Avatar>
      </Avatar.Group>,
    );

    expect(wrapper.find('span.xl-avatar--shape-square').length).toBe(2);
  });
});
