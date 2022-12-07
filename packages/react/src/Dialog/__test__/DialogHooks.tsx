import { render, act } from '@testing-library/react';
import { NoticationHookUpdate } from '@xl-vision/hooks';
import { forwardRef, useImperativeHandle } from 'react';
import { triggerTransitionEnd } from 'test/utils';
import { ConfigProvider, DedicatedDialogProps, Dialog } from '@xl-vision/react';
import { locales } from '@xl-vision/react/locale';

type DialogHookReturnType = {
  destroy: () => void;
  update: NoticationHookUpdate<DedicatedDialogProps>;
  isDestroyed: () => boolean;
};

const { useDialog } = Dialog;

const Demo = forwardRef<ReturnType<typeof useDialog>[0], {}>((_, ref) => {
  const [dialog, holder] = useDialog();

  useImperativeHandle(ref, () => {
    return { ...dialog };
  });

  return <div>{holder}</div>;
});

describe('DialogHooks', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('Test hooks', async () => {
    let dialogRef!: ReturnType<typeof useDialog>[0];

    render(
      <Demo
        ref={(it) => {
          dialogRef = it!;
        }}
      />,
    );

    expect(dialogRef).not.toBe(null);

    let el = document.querySelector('#confirm');

    expect(el).toBe(null);

    let confirmRet: DialogHookReturnType;

    act(() => {
      confirmRet = dialogRef.confirm({
        title: 'title',
        content: 'content',
        id: 'confirm',
      });
    });

    await triggerTransitionEnd();

    el = document.querySelector('#confirm');
    expect(el).not.toBe(null);

    act(() => {
      confirmRet.destroy();
    });
    await triggerTransitionEnd();

    el = document.querySelector('#confirm');
    expect(el).toBe(null);

    el = document.querySelector('#info');
    expect(el).toBe(null);

    let infoRet: DialogHookReturnType;
    act(() => {
      infoRet = dialogRef.info({
        title: 'title',
        content: 'content',
        id: 'info',
      });
    });

    await triggerTransitionEnd();

    el = document.querySelector('#info');
    expect(el).not.toBe(null);

    act(() => {
      infoRet.destroy();
    });
    await triggerTransitionEnd();

    el = document.querySelector('#info');
    expect(el).toBe(null);

    el = document.querySelector('#success');
    expect(el).toBe(null);

    let successRet: DialogHookReturnType;

    act(() => {
      successRet = dialogRef.success({
        title: 'title',
        content: 'content',
        id: 'success',
      });
    });

    await triggerTransitionEnd();

    el = document.querySelector('#success');
    expect(el).not.toBe(null);

    act(() => {
      successRet.destroy();
    });
    await triggerTransitionEnd();

    el = document.querySelector('#success');
    expect(el).toBe(null);

    el = document.querySelector('#error');
    expect(el).toBe(null);

    let errorRet: DialogHookReturnType;

    act(() => {
      errorRet = dialogRef.error({
        title: 'title',
        content: 'content',
        id: 'error',
      });
    });

    await triggerTransitionEnd();

    el = document.querySelector('#error');
    expect(el).not.toBe(null);

    act(() => {
      errorRet.destroy();
    });
    await triggerTransitionEnd();

    el = document.querySelector('#error');
    expect(el).toBe(null);

    el = document.querySelector('#warning');
    expect(el).toBe(null);

    let warningRet: DialogHookReturnType;
    act(() => {
      warningRet = dialogRef.warning({
        title: 'title',
        content: 'content',
        id: 'warning',
      });
    });

    await triggerTransitionEnd();

    el = document.querySelector('#warning');
    expect(el).not.toBe(null);

    act(() => {
      warningRet.destroy();
    });
    await triggerTransitionEnd();

    el = document.querySelector('#warning');
    expect(el).toBe(null);
  });

  it('Test destroy automic', async () => {
    let dialogRef!: ReturnType<typeof useDialog>[0];

    const { unmount } = render(
      <Demo
        ref={(it) => {
          dialogRef = it!;
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

    await triggerTransitionEnd();

    el = document.querySelector('#confirm');
    expect(el).not.toBe(null);

    unmount();

    await triggerTransitionEnd();

    el = document.querySelector('#confirm');
    expect(el).toBe(null);
  });

  it('Test context update', async () => {
    let dialogRef!: ReturnType<typeof useDialog>[0];

    const { rerender, unmount } = render(
      <ConfigProvider language='en-US'>
        <Demo
          ref={(it) => {
            dialogRef = it!;
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

    await triggerTransitionEnd();

    el = document.querySelector('#info');

    expect(el).not.toBe(null);
    expect(el!.querySelector('button')!.textContent).toBe(locales['en-US'].Dialog.methods.infoText);

    rerender(
      <ConfigProvider language='zh-CN'>
        <Demo
          ref={(it) => {
            dialogRef = it!;
          }}
        />
      </ConfigProvider>,
    );

    await triggerTransitionEnd();

    el = document.querySelector('#info');
    expect(el!.querySelector('button')!.textContent).toBe(locales['zh-CN'].Dialog.methods.infoText);

    unmount();

    await triggerTransitionEnd();

    el = document.querySelector('#info');
    expect(el).toBe(null);
  });
});
