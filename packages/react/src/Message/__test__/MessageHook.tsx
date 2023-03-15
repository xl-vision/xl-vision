import { render, act } from '@testing-library/react';
import { forwardRef, useImperativeHandle } from 'react';
import { awaitPromise, triggerTransitionEnd } from 'test/utils';
import { ConfigProvider, MessageHookReturnType, Message } from '@xl-vision/react';
import { enUS, zhCN } from '@xl-vision/react/locale';

const { useMessage } = Message;

const Demo = forwardRef<ReturnType<typeof useMessage>[0], {}>((_, ref) => {
  const [message, holder] = useMessage();

  useImperativeHandle(ref, () => {
    return { ...message };
  });

  return <div>{holder}</div>;
});

describe('MessageHooks', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('Test hooks', async () => {
    let messageRef!: ReturnType<typeof useMessage>[0];

    render(
      <Demo
        ref={(it) => {
          messageRef = it!;
        }}
      />,
    );

    expect(messageRef).not.toBe(null);

    let el = document.querySelector('#loading');

    expect(el).toBe(null);

    let confirmRet: MessageHookReturnType;

    act(() => {
      confirmRet = messageRef.loading({
        content: 'content',
        id: 'loading',
      });
    });

    await act(() => awaitPromise());

    el = document.querySelector('#loading');
    expect(el).not.toBe(null);

    act(() => {
      confirmRet.destroy();
    });

    await triggerTransitionEnd();

    el = document.querySelector('#loading');

    expect(el).toBe(null);

    el = document.querySelector('#info');
    expect(el).toBe(null);

    let infoRet: MessageHookReturnType;
    act(() => {
      infoRet = messageRef.info({
        content: 'content',
        id: 'info',
      });
    });

    await act(() => awaitPromise());

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

    let successRet: MessageHookReturnType;

    act(() => {
      successRet = messageRef.success({
        content: 'content',
        id: 'success',
      });
    });

    await act(() => awaitPromise());

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

    let errorRet: MessageHookReturnType;

    act(() => {
      errorRet = messageRef.error({
        content: 'content',
        id: 'error',
      });
    });

    await act(() => awaitPromise());

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

    let warningRet: MessageHookReturnType;
    act(() => {
      warningRet = messageRef.warning({
        content: 'content',
        id: 'warning',
      });
    });

    await act(() => awaitPromise());

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
    let messageRef!: ReturnType<typeof useMessage>[0];

    const { unmount } = render(
      <Demo
        ref={(it) => {
          messageRef = it!;
        }}
      />,
    );

    expect(messageRef).not.toBe(null);

    let el = document.querySelector('#loading');
    expect(el).toBe(null);

    act(() => {
      messageRef.loading({
        content: 'content',
        id: 'loading',
      });
    });

    await act(() => awaitPromise());

    el = document.querySelector('#loading');
    expect(el).not.toBe(null);

    unmount();

    await act(() => awaitPromise());

    el = document.querySelector('#confirm');
    expect(el).toBe(null);
  });

  it('Test context update', async () => {
    let messageRef!: ReturnType<typeof useMessage>[0];

    const { rerender, unmount } = render(
      <ConfigProvider locale={enUS}>
        <Demo
          ref={(it) => {
            messageRef = it!;
          }}
        />
      </ConfigProvider>,
    );

    expect(messageRef).not.toBe(null);

    let el = document.querySelector('#info');
    expect(el).toBe(null);

    act(() => {
      messageRef.info({
        content: 'content',
        id: 'info',
      });
    });

    await act(() => awaitPromise());

    el = document.querySelector('#info');

    expect(el).not.toBe(null);

    rerender(
      <ConfigProvider locale={zhCN}>
        <Demo
          ref={(it) => {
            messageRef = it!;
          }}
        />
      </ConfigProvider>,
    );

    await act(() => awaitPromise());

    el = document.querySelector('#info');

    unmount();

    await act(() => awaitPromise());

    el = document.querySelector('#info');
    expect(el).toBe(null);
  });
});
