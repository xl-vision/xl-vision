import { Modal } from '@xl-vision/react';
import { act, render } from '@testing-library/react';

describe('Modal', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('Test prop visible', () => {
    const { rerender } = render(
      <Modal>
        <div>body</div>
      </Modal>,
    );

    expect(document.querySelector('.xl-modal')).toBe(null);

    rerender(
      <Modal visible={true}>
        <div>body</div>
      </Modal>,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('.xl-modal')).not.toBe(null);
    expect(document.querySelector<HTMLElement>('.xl-modal__mask')?.style.display).toBe('');
    expect(document.querySelector<HTMLElement>('.xl-modal__body')?.style.display).toBe('');

    rerender(
      <Modal visible={false}>
        <div>body</div>
      </Modal>,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('.xl-modal')).not.toBe(null);
    expect(document.querySelector<HTMLElement>('.xl-modal__mask')?.style.display).toBe('none');
    expect(document.querySelector<HTMLElement>('.xl-modal__body')?.style.display).toBe('none');
  });

  it('Test onClosed', () => {
    const fn = jest.fn();
    const { rerender } = render(
      <Modal visible={true} onAfterClosed={fn}>
        <div>body</div>
      </Modal>,
    );

    expect(fn.mock.calls.length).toBe(0);

    rerender(
      <Modal visible={false} onAfterClosed={fn}>
        <div>body</div>
      </Modal>,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(fn.mock.calls.length).toBe(1);
  });

  it('Test mountOnShow', () => {
    const { rerender } = render(
      <Modal mountOnShow={true}>
        <div>body</div>
      </Modal>,
    );

    let el = document.querySelector('.xl-modal');

    expect(el).toBe(null);

    rerender(
      <Modal visible={true} mountOnShow={true}>
        <div>body</div>
      </Modal>,
    );

    act(() => {
      jest.runAllTimers();
    });

    el = document.querySelector('.xl-modal');
    expect(el).not.toBe(null);
  });

  it('Test unmountOnHide', () => {
    const { rerender } = render(
      <Modal unmountOnHide={true}>
        <div>body</div>
      </Modal>,
    );

    act(() => {
      act(() => {
        jest.runAllTimers();
      });
    });

    let el = document.querySelector('.xl-modal');

    expect(el).toBe(null);

    rerender(
      <Modal visible={true} unmountOnHide={true}>
        <div>body</div>
      </Modal>,
    );

    act(() => {
      act(() => {
        jest.runAllTimers();
      });
    });

    rerender(
      <Modal visible={false} unmountOnHide={true}>
        <div>body</div>
      </Modal>,
    );

    el = document.querySelector('.xl-modal');

    expect(el).not.toBe(null);
  });

  it('Test container', () => {
    const div = document.createElement('div');

    document.body.appendChild(div);

    render(
      <Modal container={div} visible={true}>
        <div>body</div>
      </Modal>,
    );

    expect(div.querySelector('.xl-modal')).not.toBe(null);
  });
});
