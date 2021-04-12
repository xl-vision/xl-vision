/* eslint-disable react/jsx-handler-names */
import { mount } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
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

    wrapper.unmount();
  });

  it('test onClosed', () => {
    const fn = jest.fn();
    const wrapper = mount(
      <Modal visible={true} onClosed={fn}>
        <div>body</div>
      </Modal>,
    );

    jest.runAllTimers();
    expect(fn.mock.calls.length).toBe(0);

    wrapper.setProps({
      visible: false,
    });

    jest.runAllTimers();

    expect(fn.mock.calls.length).toBe(1);
    wrapper.unmount();
  });

  it('test mountOnShow', () => {
    const wrapper = mount(
      <Modal>
        <div>body</div>
      </Modal>,
    );

    act(() => {
      jest.runAllTimers();
    });

    let el = document.querySelector('.xl-modal');

    expect(el).toBe(null);

    wrapper.setProps({
      visible: true,
    });

    act(() => {
      jest.runAllTimers();
    });

    el = document.querySelector('.xl-modal');
    expect(el).not.toBe(null);

    wrapper.unmount();
  });

  it('test unmountOnHide', () => {
    const wrapper = mount(
      <Modal>
        <div>body</div>
      </Modal>,
    );

    act(() => {
      jest.runAllTimers();
    });

    let el = document.querySelector('.xl-modal');

    expect(el).toBe(null);

    wrapper.setProps({
      visible: true,
    });

    act(() => {
      jest.runAllTimers();
    });

    wrapper.setProps({
      visible: false,
    });

    el = document.querySelector('.xl-modal');

    expect(el).not.toBe(null);

    wrapper.unmount();

    wrapper.setProps({
      unmountOnHide: true,
    });
    wrapper.mount();

    act(() => {
      jest.runAllTimers();
    });

    wrapper.setProps({
      visible: true,
    });

    act(() => {
      jest.runAllTimers();
    });

    el = document.querySelector('.xl-modal');

    expect(el).not.toBe(null);

    wrapper.setProps({
      visible: false,
    });

    act(() => {
      jest.runAllTimers();
    });

    el = document.querySelector('.xl-modal');

    expect(el).toBe(null);

    wrapper.unmount();
  });
});
