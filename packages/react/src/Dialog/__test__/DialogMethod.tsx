import React from 'react';
import { open, info, success, error, warning, confirm } from '../methods';

describe('DialogMethod', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  it('test method', () => {
    let el = document.querySelector('#method');
    expect(el).toBe(null);

    const { destroy } = open({
      title: 'title',
      content: 'content',
      id: 'method',
    });

    jest.runAllTimers();

    el = document.querySelector('#method');

    expect(el).not.toBe(null);
    expect(el).toMatchSnapshot();

    destroy();

    jest.runAllTimers();

    el = document.querySelector('#method');

    expect(el).toBe(null);
  });

  it('test info', () => {
    let el = document.querySelector('#info');
    expect(el).toBe(null);

    const { destroy } = info({
      title: 'title',
      content: 'content',
      id: 'info',
    });

    jest.runAllTimers();

    el = document.querySelector('#info');

    expect(el).not.toBe(null);
    expect(el).toMatchSnapshot();

    destroy();

    jest.runAllTimers();

    el = document.querySelector('#info');

    expect(el).toBe(null);
  });

  it('test success', () => {
    let el = document.querySelector('#success');
    expect(el).toBe(null);

    const { destroy } = success({
      title: 'title',
      content: 'content',
      id: 'success',
    });

    jest.runAllTimers();

    el = document.querySelector('#success');

    expect(el).not.toBe(null);
    expect(el).toMatchSnapshot();

    destroy();

    jest.runAllTimers();

    el = document.querySelector('#success');

    expect(el).toBe(null);
  });

  it('test error', () => {
    let el = document.querySelector('#error');
    expect(el).toBe(null);

    const { destroy } = error({
      title: 'title',
      content: 'content',
      id: 'error',
    });

    jest.runAllTimers();

    el = document.querySelector('#error');

    expect(el).not.toBe(null);
    expect(el).toMatchSnapshot();

    destroy();

    jest.runAllTimers();

    el = document.querySelector('#error');

    expect(el).toBe(null);
  });

  it('test warning', () => {
    let el = document.querySelector('#warning');
    expect(el).toBe(null);

    const { destroy } = warning({
      title: 'title',
      content: 'content',
      id: 'warning',
    });

    jest.runAllTimers();

    el = document.querySelector('#warning');

    expect(el).not.toBe(null);
    expect(el).toMatchSnapshot();

    destroy();

    jest.runAllTimers();

    el = document.querySelector('#warning');

    expect(el).toBe(null);
  });

  it('test confirm', () => {
    let el = document.querySelector('#confirm');
    expect(el).toBe(null);

    const { destroy } = confirm({
      title: 'title',
      content: 'content',
      id: 'confirm',
    });

    jest.runAllTimers();

    el = document.querySelector('#confirm');

    expect(el).not.toBe(null);
    expect(el).toMatchSnapshot();

    destroy();

    jest.runAllTimers();

    el = document.querySelector('#confirm');

    expect(el).toBe(null);
  });

  it('test update', () => {
    let el = document.querySelector('#confirm');
    expect(el).toBe(null);

    const { destroy, update } = confirm({
      title: 'title',
      content: <div id='content'>content</div>,
      id: 'confirm',
    });

    jest.runAllTimers();

    el = document.querySelector('#confirm');

    expect(el).not.toBe(null);

    expect(el!.querySelector<HTMLDivElement>('#content')!.textContent).toBe('content');

    update({
      content: <div id='content'>content2</div>,
    });

    jest.runAllTimers();

    expect(el!.querySelector<HTMLDivElement>('#content')!.textContent).toBe('content2');

    destroy();
    jest.runAllTimers();

    el = document.querySelector('#confirm');
    expect(el).toBe(null);
  });
});
