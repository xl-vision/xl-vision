import { act, screen } from '@testing-library/react';
import { triggerTransitionEnd } from 'test/utils';
import { Dialog } from '@xl-vision/react';

const { open } = Dialog;

describe('DialogMethod', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('Test method', async () => {
    let el = document.querySelector('#method');
    expect(el).toBe(null);

    const { destroy } = open({
      title: 'title',
      content: 'content',
      id: 'method',
    });

    await act(async () => {
      await triggerTransitionEnd();
    });

    screen.debug();

    el = document.querySelector('#method');

    expect(el).not.toBe(null);

    act(() => {
      destroy();
    });

    await triggerTransitionEnd();

    el = document.querySelector('#method');

    expect(el).toBe(null);
  });

  // it('Test info', async () => {
  //   let el = document.querySelector('#info');
  //   expect(el).toBe(null);

  //   const { destroy } = info({
  //     title: 'title',
  //     content: 'content',
  //     id: 'info',
  //   });

  //   await act(async () => {
  //     await awaitPromise();
  //     jest.runAllTimers();
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

  // it('test success', async () => {
  //   let el = document.querySelector('#success');
  //   expect(el).toBe(null);

  //   const { destroy } = success({
  //     title: 'title',
  //     content: 'content',
  //     id: 'success',
  //   });

  //   await triggerTransitionEnd();

  //   el = document.querySelector('#success');

  //   expect(el).not.toBe(null);

  //   act(() => {
  //     destroy();
  //   });

  //   await triggerTransitionEnd();

  //   el = document.querySelector('#success');

  //   expect(el).toBe(null);
  // });

  // it('test error', async () => {
  //   let el = document.querySelector('#error');
  //   expect(el).toBe(null);

  //   const { destroy } = error({
  //     title: 'title',
  //     content: 'content',
  //     id: 'error',
  //   });

  //   await triggerTransitionEnd();

  //   el = document.querySelector('#error');

  //   expect(el).not.toBe(null);

  //   act(() => {
  //     destroy();
  //   });

  //   await triggerTransitionEnd();

  //   el = document.querySelector('#error');

  //   expect(el).toBe(null);
  // });

  // it('test warning', async () => {
  //   let el = document.querySelector('#warning');
  //   expect(el).toBe(null);

  //   const { destroy } = warning({
  //     title: 'title',
  //     content: 'content',
  //     id: 'warning',
  //   });

  //   await triggerTransitionEnd();

  //   el = document.querySelector('#warning');

  //   expect(el).not.toBe(null);

  //   act(() => {
  //     destroy();
  //   });

  //   await triggerTransitionEnd();

  //   el = document.querySelector('#warning');

  //   expect(el).toBe(null);
  // });

  // it('test confirm', async () => {
  //   let el = document.querySelector('#confirm');
  //   expect(el).toBe(null);

  //   const { destroy } = confirm({
  //     title: 'title',
  //     content: 'content',
  //     id: 'confirm',
  //   });

  //   await triggerTransitionEnd();

  //   el = document.querySelector('#confirm');

  //   expect(el).not.toBe(null);

  //   act(() => {
  //     destroy();
  //   });

  //   await triggerTransitionEnd();

  //   el = document.querySelector('#confirm');

  //   expect(el).toBe(null);
  // });

  // it('test destroyAll', async () => {
  //   info({
  //     title: 'title',
  //     content: 'content',
  //     id: 'info1',
  //   });

  //   await triggerTransitionEnd();

  //   let el1 = document.querySelector('#info1');

  //   expect(el1).not.toBe(null);

  //   info({
  //     title: 'title',
  //     content: 'content',
  //     id: 'info2',
  //   });

  //   await triggerTransitionEnd();

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

  // it('test update', async () => {
  //   let el = document.querySelector('#confirm');
  //   expect(el).toBe(null);

  //   const { destroy, update } = confirm({
  //     title: 'title',
  //     content: <div id='content'>content</div>,
  //     id: 'confirm',
  //   });

  //   await triggerTransitionEnd();

  //   el = document.querySelector('#confirm');

  //   expect(el).not.toBe(null);

  //   expect(el!.querySelector<HTMLDivElement>('#content')!.textContent).toBe('content');

  //   act(() => {
  //     update({
  //       content: <div id='content'>content2</div>,
  //     });
  //   });

  //   await triggerTransitionEnd();

  //   expect(el!.querySelector<HTMLDivElement>('#content')!.textContent).toBe('content2');

  //   act(() => {
  //     destroy();
  //   });

  //   await triggerTransitionEnd();

  //   el = document.querySelector('#confirm');
  //   expect(el).toBe(null);
  // });
});
