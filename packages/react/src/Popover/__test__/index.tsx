import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Popover } from '@xl-vision/react';

describe('Popover', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('test trigger click', () => {
    const wrapper = mount(
      <Popover content={<span id='content'>content</span>}>
        <button id='btn'>button</button>
      </Popover>,
    );
    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('#content')).toBe(null);

    wrapper.find('#btn').simulate('click');

    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('#content')).not.toBe(null);
  });
});
