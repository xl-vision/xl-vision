import { mount } from 'enzyme';
import React from 'react';
import Modal from '..';

describe('Modal', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  it('test prop visible', () => {
    const wrapper = mount(
      <Modal>
        <div>body</div>
      </Modal>,
    );

    jest.runAllTimers();

    expect(document.querySelector('.xl-modal')).toBe(null);

    wrapper.setProps({
      visible: true,
    });

    jest.runAllTimers();
    expect(document.querySelector('.xl-modal')).not.toBe(null);
    expect(document.querySelector<HTMLElement>('.xl-modal__mask')?.style.display).toBe('');
    expect(document.querySelector<HTMLElement>('.xl-modal__body')?.style.display).toBe('');

    wrapper.setProps({
      visible: false,
    });

    jest.runAllTimers();

    expect(document.querySelector('.xl-modal')).not.toBe(null);
    expect(document.querySelector<HTMLElement>('.xl-modal__mask')?.style.display).toBe('none');
    expect(document.querySelector<HTMLElement>('.xl-modal__body')?.style.display).toBe('none');
  });
});
