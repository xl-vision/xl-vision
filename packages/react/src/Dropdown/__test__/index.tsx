import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import Dropdown from '..';

const menus = (
  <>
    <Dropdown.Item>item1</Dropdown.Item>
    <Dropdown.Item disabled={true}>item2</Dropdown.Item>
    <Dropdown.Divider />
    <Dropdown.Submenu title='submenu'>
      <Dropdown.Item>3rd menu item</Dropdown.Item>
      <Dropdown.Item disabled={true}>4th menu item</Dropdown.Item>
    </Dropdown.Submenu>
    <Dropdown.Item>item3</Dropdown.Item>
  </>
);

describe('Dropdown', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('test trigger hover', () => {
    const wrapper = mount(
      <Dropdown menus={menus}>
        <button id='btn'>button</button>
      </Dropdown>,
    );
    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('.xl-dropdown-item')).toBe(null);

    wrapper.find('#btn').simulate('mouseenter');

    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('.xl-dropdown-item')).not.toBe(null);

    wrapper.unmount();
  });
});
