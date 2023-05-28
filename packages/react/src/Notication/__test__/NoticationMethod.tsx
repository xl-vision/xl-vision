// import { act } from '@testing-library/react';
// import { awaitPromise, triggerTransitionEnd } from 'test/utils';
// import { Notication } from '@xl-vision/react';

// const { destroyAll, error, info, open, success, warning } = Notication;

describe('NoticationMethod', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it.todo('Test method');
  // it('Test method', async () => {
  //   let el = document.querySelector('#method');
  //   expect(el).toBe(null);

  //   const { destroy } = open({
  //     message: 'message',
  //     id: 'method',
  //   });

  //   await act(async () => {
  //     await awaitPromise();
  //   });

  //   el = document.querySelector('#method');

  //   expect(el).not.toBe(null);

  //   act(() => {
  //     destroy();
  //   });

  //   await triggerTransitionEnd();

  //   el = document.querySelector('#method');

  //   expect(el).toBe(null);
  // });

  it.todo('Test info');
  // it('Test info', async () => {
  //   let el = document.querySelector('#info');
  //   expect(el).toBe(null);

  //   const { destroy } = info({
  //     message: 'message',
  //     id: 'info',
  //   });

  //   await act(async () => {
  //     await awaitPromise();
  //   });

  //   el = document.querySelector('#info');

  //   expect(el).not.toBe(null);

  //   act(() => {
  //     destroy();
  //   });

  //   await triggerTransitionEnd();

  //   el = document.querySelector('#info');

  //   expect(el).toBe(null);
  // });

  it.todo('Test success');
  // it('test success', async () => {
  //   let el = document.querySelector('#success');
  //   expect(el).toBe(null);

  //   const { destroy } = success({
  //     message: 'message',
  //     id: 'success',
  //   });

  //   await act(async () => {
  //     await awaitPromise();
  //   });

  //   el = document.querySelector('#success');

  //   expect(el).not.toBe(null);

  //   act(() => {
  //     destroy();
  //   });

  //   await triggerTransitionEnd();

  //   el = document.querySelector('#success');

  //   expect(el).toBe(null);
  // });

  it.todo('Test error');
  // it('test error', async () => {
  //   let el = document.querySelector('#error');
  //   expect(el).toBe(null);

  //   const { destroy } = error({
  //     message: 'message',
  //     id: 'error',
  //   });

  //   await act(async () => {
  //     await awaitPromise();
  //   });

  //   el = document.querySelector('#error');

  //   expect(el).not.toBe(null);

  //   act(() => {
  //     destroy();
  //   });

  //   await triggerTransitionEnd();

  //   el = document.querySelector('#error');

  //   expect(el).toBe(null);
  // });

  it.todo('Test warning');
  // it('test warning', async () => {
  //   let el = document.querySelector('#warning');
  //   expect(el).toBe(null);

  //   const { destroy } = warning({
  //     message: 'message',
  //     id: 'warning',
  //   });

  //   await act(async () => {
  //     await awaitPromise();
  //   });

  //   el = document.querySelector('#warning');

  //   expect(el).not.toBe(null);

  //   act(() => {
  //     destroy();
  //   });

  //   await triggerTransitionEnd();

  //   el = document.querySelector('#warning');

  //   expect(el).toBe(null);
  // });

  it.todo('Test destroyAll');
  // it('test destroyAll', async () => {
  //   info({
  //     message: 'message',
  //     id: 'info1',
  //   });

  //   await act(async () => {
  //     await awaitPromise();
  //   });

  //   let el1 = document.querySelector('#info1');

  //   expect(el1).not.toBe(null);

  //   info({
  //     message: 'message',
  //     id: 'info2',
  //   });

  //   await act(async () => {
  //     await awaitPromise();
  //   });

  //   let el2 = document.querySelector('#info2');

  //   expect(el2).not.toBe(null);

  //   act(() => {
  //     destroyAll();
  //   });

  //   await triggerTransitionEnd();

  //   el1 = document.querySelector('#info1');
  //   el2 = document.querySelector('#info2');

  //   expect(el1).toBe(null);
  //   expect(el2).toBe(null);
  // });

  it.todo('Test update');
  // it('test update', async () => {
  //   let el = document.querySelector('#info');
  //   expect(el).toBe(null);

  //   const { destroy, update } = info({
  //     message: <div id='message'>message</div>,
  //     id: 'info',
  //   });

  //   await act(async () => {
  //     await awaitPromise();
  //   });

  //   el = document.querySelector('#info');

  //   expect(el).not.toBe(null);

  //   expect(el!.querySelector<HTMLDivElement>('#message')!.textContent).toBe('message');

  //   act(() => {
  //     update({
  //       message: <div id='message'>message2</div>,
  //     });
  //   });

  //   await act(async () => {
  //     await awaitPromise();
  //   });

  //   expect(el!.querySelector<HTMLDivElement>('#message')!.textContent).toBe('message2');

  //   act(() => {
  //     destroy();
  //   });

  //   await triggerTransitionEnd();

  //   el = document.querySelector('#info');
  //   expect(el).toBe(null);
  // });
});
