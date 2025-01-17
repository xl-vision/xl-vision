import { render } from '@testing-library/react';
import { forwardRef, useImperativeHandle, act } from 'react';
import { awaitPromise, triggerTransitionEnd } from 'test/utils';
import { ThemeProvider, NoticationHookReturnType, Notication } from '@xl-vision/react';
import { enUS, zhCN } from '@xl-vision/react/locale';

const { useNotication } = Notication;

const Demo = forwardRef<ReturnType<typeof useNotication>[0], unknown>((_, ref) => {
  const [notication, holder] = useNotication();

  useImperativeHandle(ref, () => {
    return { ...notication };
  });

  return <div>{holder}</div>;
});

describe('NoticationHooks', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('Test hooks', async () => {
    let noticationRef!: ReturnType<typeof useNotication>[0];

    render(
      <Demo
        ref={(it) => {
          noticationRef = it!;
        }}
      />,
    );

    expect(noticationRef).not.toBe(null);

    let el = document.querySelector('#success');

    expect(el).toBe(null);

    let confirmRet: NoticationHookReturnType;

    act(() => {
      confirmRet = noticationRef.success({
        message: 'message',
        id: 'success',
      });
    });

    await act(() => awaitPromise());

    el = document.querySelector('#success');
    expect(el).not.toBe(null);

    act(() => {
      confirmRet.destroy();
    });

    await triggerTransitionEnd();

    el = document.querySelector('#success');

    expect(el).toBe(null);

    el = document.querySelector('#info');
    expect(el).toBe(null);

    let infoRet: NoticationHookReturnType;
    act(() => {
      infoRet = noticationRef.info({
        message: 'message',
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

    let successRet: NoticationHookReturnType;

    act(() => {
      successRet = noticationRef.success({
        message: 'message',
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

    let errorRet: NoticationHookReturnType;

    act(() => {
      errorRet = noticationRef.error({
        message: 'message',
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

    let warningRet: NoticationHookReturnType;
    act(() => {
      warningRet = noticationRef.warning({
        message: 'message',
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
    let noticationRef!: ReturnType<typeof useNotication>[0];

    const { unmount } = render(
      <Demo
        ref={(it) => {
          noticationRef = it!;
        }}
      />,
    );

    expect(noticationRef).not.toBe(null);

    let el = document.querySelector('#success');
    expect(el).toBe(null);

    act(() => {
      noticationRef
        .success({
          message: 'message',
          id: 'success',
        })
        .catch(console.error);
    });

    await act(() => awaitPromise());

    el = document.querySelector('#success');
    expect(el).not.toBe(null);

    unmount();

    await act(() => awaitPromise());

    el = document.querySelector('#confirm');
    expect(el).toBe(null);
  });

  it('Test context update', async () => {
    let noticationRef!: ReturnType<typeof useNotication>[0];

    const { rerender, unmount } = render(
      <ThemeProvider locale={enUS}>
        <Demo
          ref={(it) => {
            noticationRef = it!;
          }}
        />
      </ThemeProvider>,
    );

    expect(noticationRef).not.toBe(null);

    let el = document.querySelector('#info');
    expect(el).toBe(null);

    act(() => {
      noticationRef
        .info({
          message: 'message',
          id: 'info',
        })
        .catch(console.error);
    });

    await act(() => awaitPromise());

    el = document.querySelector('#info');

    expect(el).not.toBe(null);

    rerender(
      <ThemeProvider locale={zhCN}>
        <Demo
          ref={(it) => {
            noticationRef = it!;
          }}
        />
      </ThemeProvider>,
    );

    await act(() => awaitPromise());

    el = document.querySelector('#info');

    unmount();

    await act(() => awaitPromise());

    el = document.querySelector('#info');
    expect(el).toBe(null);
  });
});
