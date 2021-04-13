/* eslint-disable no-return-assign */
import { locales } from '@xl-vision/react/locale';
import LocalizationProvider from '@xl-vision/react/LocalizationProvider';
import { mount } from 'enzyme';
import React from 'react';
import useDialog from '../useDialog';

const Demo = React.forwardRef<ReturnType<typeof useDialog>, {}>((_, ref) => {
  const dialog = useDialog();

  React.useImperativeHandle(ref, () => {
    return { ...dialog };
  });

  return <div />;
});

describe('DialogHooks', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('test hooks', () => {
    let dialogRef!: ReturnType<typeof useDialog>;
    mount(
      <Demo
        ref={(it) => {
          return (dialogRef = it!);
        }}
      />,
    );

    expect(dialogRef).not.toBe(null);

    let el = document.querySelector('#confirm');
    expect(el).toBe(null);

    const confirmRet = dialogRef.confirm({
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

    const infoRet = dialogRef.info({
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

    const successRet = dialogRef.success({
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

    const errorRet = dialogRef.error({
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

    const warningRet = dialogRef.warning({
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
    let dialogRef!: ReturnType<typeof useDialog>;
    const wrapper = mount(
      <Demo
        ref={(it) => {
          return (dialogRef = it!);
        }}
      />,
    );

    expect(dialogRef).not.toBe(null);

    let el = document.querySelector('#confirm');
    expect(el).toBe(null);

    dialogRef.confirm({
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
    let dialogRef!: ReturnType<typeof useDialog>;
    const wrapper = mount(
      <LocalizationProvider language='en-US'>
        <Demo
          ref={(it) => {
            return (dialogRef = it!);
          }}
        />
      </LocalizationProvider>,
    );

    expect(dialogRef).not.toBe(null);

    let el = document.querySelector('#info');
    expect(el).toBe(null);

    dialogRef.info({
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
