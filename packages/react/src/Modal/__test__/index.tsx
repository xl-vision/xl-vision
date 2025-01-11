import { render } from '@testing-library/react';
import { triggerTransitionEnd } from 'test/utils';
import { Modal } from '@xl-vision/react';

describe('Modal', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('Test prop open', async () => {
    const { rerender } = render(
      <Modal>
        <div>body</div>
      </Modal>,
    );

    await triggerTransitionEnd();

    expect(document.querySelector('.xl-modal')).toBe(null);

    rerender(
      <Modal open={true}>
        <div>body</div>
      </Modal>,
    );

    await triggerTransitionEnd();

    expect(document.querySelector('.xl-modal')).not.toBe(null);
    expect(document.querySelector<HTMLElement>('.xl-modal__mask')?.style.display).toBe('');
    expect(document.querySelector<HTMLElement>('.xl-modal__body')?.style.display).toBe('');

    rerender(
      <Modal open={false}>
        <div>body</div>
      </Modal>,
    );

    await triggerTransitionEnd();

    expect(document.querySelector('.xl-modal')).not.toBe(null);
    expect(document.querySelector<HTMLElement>('.xl-modal__mask')?.style.display).toBe('none');
    expect(document.querySelector<HTMLElement>('.xl-modal__body')?.style.display).toBe('none');
  });

  it('Test onClosed', async () => {
    const fn = jest.fn();
    const { rerender } = render(
      <Modal open={true} onAfterClosed={fn}>
        <div>body</div>
      </Modal>,
    );

    await triggerTransitionEnd();

    expect(fn.mock.calls.length).toBe(0);

    rerender(
      <Modal open={false} onAfterClosed={fn}>
        <div>body</div>
      </Modal>,
    );

    await triggerTransitionEnd();

    expect(fn.mock.calls.length).toBe(1);
  });

  it('Test mountOnShow', async () => {
    const { rerender } = render(
      <Modal mountOnShow={true}>
        <div>body</div>
      </Modal>,
    );

    await triggerTransitionEnd();

    let el = document.querySelector('.xl-modal');

    expect(el).toBe(null);

    rerender(
      <Modal mountOnShow={true} open={true}>
        <div>body</div>
      </Modal>,
    );

    await triggerTransitionEnd();

    el = document.querySelector('.xl-modal');
    expect(el).not.toBe(null);
  });

  it('Test unmountOnHide', async () => {
    const { rerender } = render(
      <Modal unmountOnHide={true}>
        <div>body</div>
      </Modal>,
    );

    await triggerTransitionEnd();

    let el = document.querySelector('.xl-modal');

    expect(el).toBe(null);

    rerender(
      <Modal open={true} unmountOnHide={true}>
        <div>body</div>
      </Modal>,
    );

    await triggerTransitionEnd();

    el = document.querySelector('.xl-modal');
    expect(el).not.toBe(null);

    rerender(
      <Modal open={false} unmountOnHide={true}>
        <div>body</div>
      </Modal>,
    );

    await triggerTransitionEnd();

    el = document.querySelector('.xl-modal');

    expect(el).toBe(null);
  });

  it('Test container', async () => {
    const div = document.createElement('div');

    document.body.append(div);

    render(
      <Modal container={div} open={true}>
        <div>body</div>
      </Modal>,
    );

    await triggerTransitionEnd();

    expect(div.querySelector('.xl-modal')).not.toBe(null);
  });
});
