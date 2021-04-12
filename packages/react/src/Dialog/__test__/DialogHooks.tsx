/* eslint-disable no-return-assign */
import { locales } from '@xl-vision/react/locale';
import LocalizationProvider from '@xl-vision/react/LocalizationProvider';
import { mount } from 'enzyme';
import React from 'react';
import useHooks from '../useHooks';

const Demo = React.forwardRef<ReturnType<typeof useHooks>, {}>((_, ref) => {
  const Modal = useHooks();

  React.useImperativeHandle(ref, () => {
    return { ...Modal };
  });

  return <div />;
});

describe('DialogHooks', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('test hooks', () => {
    let refs!: ReturnType<typeof useHooks>;
    mount(
      <Demo
        ref={(it) => {
          return (refs = it!);
        }}
      />,
    );

    expect(refs).not.toBe(null);

    let el = document.querySelector('#confirm');
    expect(el).toBe(null);

    const confirmRet = refs.confirm({
      defaultVisible: true,
      title: 'title',
      content: 'content',
      id: 'confirm',
    });

    jest.runAllTimers();

    el = document.querySelector('#confirm');
    expect(el).not.toBe(null);

    confirmRet.destroy();
    jest.runAllTimers();

    el = document.querySelector('#confirm');
    expect(el).toBe(null);

    el = document.querySelector('#info');
    expect(el).toBe(null);

    const infoRet = refs.info({
      defaultVisible: true,
      title: 'title',
      content: 'content',
      id: 'info',
    });

    jest.runAllTimers();

    el = document.querySelector('#info');
    expect(el).not.toBe(null);

    infoRet.destroy();
    jest.runAllTimers();

    el = document.querySelector('#info');
    expect(el).toBe(null);

    el = document.querySelector('#success');
    expect(el).toBe(null);

    const successRet = refs.success({
      defaultVisible: true,
      title: 'title',
      content: 'content',
      id: 'success',
    });

    jest.runAllTimers();

    el = document.querySelector('#success');
    expect(el).not.toBe(null);

    successRet.destroy();
    jest.runAllTimers();

    el = document.querySelector('#success');
    expect(el).toBe(null);

    el = document.querySelector('#error');
    expect(el).toBe(null);

    const errorRet = refs.error({
      defaultVisible: true,
      title: 'title',
      content: 'content',
      id: 'error',
    });

    jest.runAllTimers();

    el = document.querySelector('#error');
    expect(el).not.toBe(null);

    errorRet.destroy();
    jest.runAllTimers();

    el = document.querySelector('#error');
    expect(el).toBe(null);

    el = document.querySelector('#warning');
    expect(el).toBe(null);

    const warningRet = refs.warning({
      defaultVisible: true,
      title: 'title',
      content: 'content',
      id: 'warning',
    });

    jest.runAllTimers();

    el = document.querySelector('#warning');
    expect(el).not.toBe(null);

    warningRet.destroy();
    jest.runAllTimers();

    el = document.querySelector('#warning');
    expect(el).toBe(null);
  });

  it('test destroy automic', () => {
    let refs!: ReturnType<typeof useHooks>;
    const wrapper = mount(
      <Demo
        ref={(it) => {
          return (refs = it!);
        }}
      />,
    );

    expect(refs).not.toBe(null);

    let el = document.querySelector('#confirm');
    expect(el).toBe(null);

    refs.confirm({
      defaultVisible: true,
      title: 'title',
      content: 'content',
      id: 'confirm',
    });

    jest.runAllTimers();

    el = document.querySelector('#confirm');
    expect(el).not.toBe(null);

    wrapper.unmount();
    jest.runAllTimers();

    el = document.querySelector('#confirm');
    expect(el).toBe(null);
  });

  it('test context update', () => {
    let refs!: ReturnType<typeof useHooks>;
    const wrapper = mount(
      <LocalizationProvider language='en-US'>
        <Demo
          ref={(it) => {
            return (refs = it!);
          }}
        />
      </LocalizationProvider>,
    );

    expect(refs).not.toBe(null);

    let el = document.querySelector('#info');
    expect(el).toBe(null);

    refs.info({
      defaultVisible: true,
      title: 'title',
      content: 'content',
      id: 'info',
    });

    jest.runAllTimers();

    el = document.querySelector('#info');
    expect(el).not.toBe(null);
    expect(el!.querySelector('button')!.textContent).toBe(locales['en-US'].MethodDialog.infoText);

    wrapper.setProps({
      language: 'zh-CN',
    });

    jest.runAllTimers();

    el = document.querySelector('#info');
    expect(el!.querySelector('button')!.textContent).toBe(locales['zh-CN'].MethodDialog.infoText);

    wrapper.unmount();
    jest.runAllTimers();

    el = document.querySelector('#info');
    expect(el).toBe(null);
  });
});
