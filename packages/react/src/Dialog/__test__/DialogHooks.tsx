/* eslint-disable no-return-assign */
import { ConfigProvider } from '@xl-vision/react';
import { locales } from '@xl-vision/react/locale';
import { mount } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import useDialog, { MessageDialogHookReturnType } from '../useDialog';

const Demo = React.forwardRef<ReturnType<typeof useDialog>[0], {}>((_, ref) => {
  const [dialog, holder] = useDialog();

  React.useImperativeHandle(ref, () => {
    return { ...dialog };
  });

  return <div>{holder}</div>;
});

describe('DialogHooks', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('test hooks', () => {
    let dialogRef!: ReturnType<typeof useDialog>[0];
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

    let confirmRet: MessageDialogHookReturnType;

    act(() => {
      confirmRet = dialogRef.confirm({
        title: 'title',
        content: 'content',
        id: 'confirm',
      });
    });

    jest.runAllTimers();

    el = document.querySelector('#confirm');
    expect(el).not.toBe(null);

    act(() => {
      confirmRet.destroy();
    });
    jest.runAllTimers();

    el = document.querySelector('#confirm');
    expect(el).toBe(null);

    el = document.querySelector('#info');
    expect(el).toBe(null);

    let infoRet: MessageDialogHookReturnType;
    act(() => {
      infoRet = dialogRef.info({
        title: 'title',
        content: 'content',
        id: 'info',
      });
    });

    jest.runAllTimers();

    el = document.querySelector('#info');
    expect(el).not.toBe(null);

    act(() => {
      infoRet.destroy();
    });
    jest.runAllTimers();

    el = document.querySelector('#info');
    expect(el).toBe(null);

    el = document.querySelector('#success');
    expect(el).toBe(null);

    let successRet: MessageDialogHookReturnType;

    act(() => {
      successRet = dialogRef.success({
        title: 'title',
        content: 'content',
        id: 'success',
      });
    });

    jest.runAllTimers();

    el = document.querySelector('#success');
    expect(el).not.toBe(null);

    act(() => {
      successRet.destroy();
    });
    jest.runAllTimers();

    el = document.querySelector('#success');
    expect(el).toBe(null);

    el = document.querySelector('#error');
    expect(el).toBe(null);

    let errorRet: MessageDialogHookReturnType;

    act(() => {
      errorRet = dialogRef.error({
        title: 'title',
        content: 'content',
        id: 'error',
      });
    });

    jest.runAllTimers();

    el = document.querySelector('#error');
    expect(el).not.toBe(null);

    act(() => {
      errorRet.destroy();
    });
    jest.runAllTimers();

    el = document.querySelector('#error');
    expect(el).toBe(null);

    el = document.querySelector('#warning');
    expect(el).toBe(null);

    let warningRet: MessageDialogHookReturnType;
    act(() => {
      warningRet = dialogRef.warning({
        title: 'title',
        content: 'content',
        id: 'warning',
      });
    });

    jest.runAllTimers();

    el = document.querySelector('#warning');
    expect(el).not.toBe(null);

    act(() => {
      warningRet.destroy();
    });
    jest.runAllTimers();

    el = document.querySelector('#warning');
    expect(el).toBe(null);
  });

  it('test destroy automic', () => {
    let dialogRef!: ReturnType<typeof useDialog>[0];
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

    act(() => {
      dialogRef.confirm({
        title: 'title',
        content: 'content',
        id: 'confirm',
      });
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
    let dialogRef!: ReturnType<typeof useDialog>[0];
    const wrapper = mount(
      <ConfigProvider language='en-US'>
        <Demo
          ref={(it) => {
            return (dialogRef = it!);
          }}
        />
      </ConfigProvider>,
    );

    expect(dialogRef).not.toBe(null);

    let el = document.querySelector('#info');
    expect(el).toBe(null);

    act(() => {
      dialogRef.info({
        title: 'title',
        content: 'content',
        id: 'info',
      });
    });

    jest.runAllTimers();

    el = document.querySelector('#info');

    expect(el).not.toBe(null);
    expect(el!.querySelector('button')!.textContent).toBe(
      locales['en-US'].Dialog.messages.infoText,
    );

    wrapper.setProps({
      language: 'zh-CN',
    });

    jest.runAllTimers();

    el = document.querySelector('#info');
    expect(el!.querySelector('button')!.textContent).toBe(
      locales['zh-CN'].Dialog.messages.infoText,
    );

    wrapper.unmount();
    jest.runAllTimers();

    el = document.querySelector('#info');
    expect(el).toBe(null);
  });
});
