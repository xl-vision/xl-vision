import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import Tooltip from '..';

describe('Tooltip', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('test trigger hover', () => {
    const wrapper = mount(
      <Tooltip content={<span id='content'>content</span>}>
        <button id='btn'>button</button>
      </Tooltip>,
    );
    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('#content')).toBe(null);

    wrapper.find('#btn').simulate('mouseenter');

    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('#content')).not.toBe(null);
    wrapper.unmount();
  });

  it('test trigger touch', () => {
    const wrapper = mount(
      <Tooltip content={<span id='content'>content</span>}>
        <button id='btn'>button</button>
      </Tooltip>,
    );
    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('#content')).toBe(null);

    wrapper.find('#btn').simulate('touchstart');

    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('#content')).not.toBe(null);

    wrapper.find('#btn').simulate('touchend');

    act(() => {
      jest.runAllTimers();
    });

    expect(
      (document.querySelector('#content')?.parentNode?.parentNode as HTMLElement).style.display,
    ).toBe('none');

    wrapper.unmount();
  });
});
