import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Dropdown } from '@xl-vision/react';

const menus = (
  <>
    <Dropdown.Item id='item1'>item1</Dropdown.Item>
    <Dropdown.Item id='item2' disabled={true}>
      item2
    </Dropdown.Item>
    <Dropdown.Divider />
    <Dropdown.Submenu title={<div id='submenu-title'>submenu</div>} id='submenu'>
      <Dropdown.Item id='item3'>3rd menu item</Dropdown.Item>
      <Dropdown.Item id='item4' disabled={true}>
        4th menu item
      </Dropdown.Item>
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
      <Dropdown menus={menus} id='popup'>
        <button id='btn'>button</button>
      </Dropdown>,
    );
    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('div#popup')).toBe(null);

    wrapper.find('button#btn').simulate('mouseenter');

    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('div#popup')!.firstChild as HTMLDivElement).not.toBe(null);
    expect((document.querySelector('div#popup')!.firstChild as HTMLDivElement).style.display).toBe(
      '',
    );

    (document.querySelector('li#item1') as HTMLLIElement).click();

    act(() => {
      jest.runAllTimers();
    });

    expect((document.querySelector('#popup')!.firstChild as HTMLDivElement).style.display).toBe(
      'none',
    );

    wrapper.find('#btn').simulate('mouseenter');

    act(() => {
      jest.runAllTimers();
    });

    expect((document.querySelector('#popup')!.firstChild as HTMLDivElement).style.display).toBe('');

    wrapper.find('li#item2').simulate('click');
    act(() => {
      jest.runAllTimers();
    });
    expect((document.querySelector('#popup')!.firstChild as HTMLDivElement).style.display).toBe('');

    wrapper.unmount();
  });
});
