import { mount } from 'enzyme';
import React from 'react';
import Dialog from '..';

describe('Dialog', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  it('test prop visible', () => {
    const wrapper = mount(
      <Dialog title='title'>
        <div>body</div>
      </Dialog>,
    );

    jest.runAllTimers();

    expect(document.querySelector('.xl-dialog')).toBe(null);

    wrapper.setProps({
      visible: true,
    });

    jest.runAllTimers();
    expect(document.querySelector('.xl-dialog')).not.toBe(null);
    expect(document.querySelector<HTMLElement>('.xl-dialog')?.style.display).toBe('');

    wrapper.setProps({
      visible: false,
    });

    jest.runAllTimers();

    expect(document.querySelector('.xl-dialog')).not.toBe(null);
    expect(document.querySelector<HTMLElement>('.xl-dialog')?.style.display).toBe('none');

    wrapper.unmount();
  });
});
