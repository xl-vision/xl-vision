import { act } from '@testing-library/react';
import { awaitPromise, triggerTransitionEnd } from 'test/utils';
import { Message } from '@xl-vision/react';

const { destroyAll, error, info, open, success, warning, loading } = Message;

describe('MessageMethod', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('Test method', async () => {
    let el = document.querySelector('#method');
    expect(el).toBe(null);

    const { destroy } = open({
      content: 'content',
      id: 'method',
    });

    await act(async () => {
      await awaitPromise();
    });

    el = document.querySelector('#method');

    expect(el).not.toBe(null);

    act(() => {
      destroy();
    });

    await triggerTransitionEnd();

    el = document.querySelector('#method');

    expect(el).toBe(null);
  });

  it('Test info', async () => {
    let el = document.querySelector('#info');
    expect(el).toBe(null);

    const { destroy } = info({
      content: 'content',
      id: 'info',
    });

    await act(async () => {
      await awaitPromise();
    });

    el = document.querySelector('#info');

    expect(el).not.toBe(null);

    act(() => {
      destroy();
    });

    await triggerTransitionEnd();

    el = document.querySelector('#info');

    expect(el).toBe(null);
  });

  it('test success', async () => {
    let el = document.querySelector('#success');
    expect(el).toBe(null);

    const { destroy } = success({
      content: 'content',
      id: 'success',
    });

    await act(async () => {
      await awaitPromise();
    });

    el = document.querySelector('#success');

    expect(el).not.toBe(null);

    act(() => {
      destroy();
    });

    await triggerTransitionEnd();

    el = document.querySelector('#success');

    expect(el).toBe(null);
  });

  it('test error', async () => {
    let el = document.querySelector('#error');
    expect(el).toBe(null);

    const { destroy } = error({
      content: 'content',
      id: 'error',
    });

    await act(async () => {
      await awaitPromise();
    });

    el = document.querySelector('#error');

    expect(el).not.toBe(null);

    act(() => {
      destroy();
    });

    await triggerTransitionEnd();

    el = document.querySelector('#error');

    expect(el).toBe(null);
  });

  it('test warning', async () => {
    let el = document.querySelector('#warning');
    expect(el).toBe(null);

    const { destroy } = warning({
      content: 'content',
      id: 'warning',
    });

    await act(async () => {
      await awaitPromise();
    });

    el = document.querySelector('#warning');

    expect(el).not.toBe(null);

    act(() => {
      destroy();
    });

    await triggerTransitionEnd();

    el = document.querySelector('#warning');

    expect(el).toBe(null);
  });

  it('test loading', async () => {
    let el = document.querySelector('#loading');
    expect(el).toBe(null);

    const { destroy } = loading({
      content: 'content',
      id: 'loading',
    });

    await act(async () => {
      await awaitPromise();
    });

    el = document.querySelector('#loading');

    expect(el).not.toBe(null);

    act(() => {
      destroy();
    });

    await triggerTransitionEnd();

    el = document.querySelector('#loading');

    expect(el).toBe(null);
  });

  it('test destroyAll', async () => {
    info({
      content: 'content',
      id: 'info1',
    });

    await act(async () => {
      await awaitPromise();
    });

    let el1 = document.querySelector('#info1');

    expect(el1).not.toBe(null);

    info({
      content: 'content',
      id: 'info2',
    });

    await act(async () => {
      await awaitPromise();
    });

    let el2 = document.querySelector('#info2');

    expect(el2).not.toBe(null);

    act(() => {
      destroyAll();
    });

    await triggerTransitionEnd();

    el1 = document.querySelector('#info1');
    el2 = document.querySelector('#info2');

    expect(el1).toBe(null);
    expect(el2).toBe(null);
  });

  it('test update', async () => {
    let el = document.querySelector('#loading');
    expect(el).toBe(null);

    const { destroy, update } = loading({
      content: <div id='content'>content</div>,
      id: 'loading',
    });

    await act(async () => {
      await awaitPromise();
    });

    el = document.querySelector('#loading');

    expect(el).not.toBe(null);

    expect(el!.querySelector<HTMLDivElement>('#content')!.textContent).toBe('content');

    act(() => {
      update({
        content: <div id='content'>content2</div>,
      });
    });

    await act(async () => {
      await awaitPromise();
    });

    expect(el!.querySelector<HTMLDivElement>('#content')!.textContent).toBe('content2');

    act(() => {
      destroy();
    });

    await triggerTransitionEnd();

    el = document.querySelector('#loading');
    expect(el).toBe(null);
  });
});
