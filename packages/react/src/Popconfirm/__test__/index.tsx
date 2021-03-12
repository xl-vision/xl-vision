import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import Popconfirm from '..';

describe('Popconfirm', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('test trigger click', () => {
    const wrapper = mount(
      <Popconfirm title='content'>
        <button id='btn'>button</button>
      </Popconfirm>,
    );
    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('.xl-popconfirm__popup')).toBe(null);

    wrapper.find('#btn').simulate('click');

    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('.xl-popconfirm__popup')).not.toBe(null);
  });
});
