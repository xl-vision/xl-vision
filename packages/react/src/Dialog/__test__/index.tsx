import { render } from '@testing-library/react';
import { Dialog } from '@xl-vision/react';
import { triggerTransitionEnd } from 'test/utils';

describe('Dialog', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  it('Test prop visible', async () => {
    const { rerender } = render(
      <Dialog title='title'>
        <div>body</div>
      </Dialog>,
    );

    await triggerTransitionEnd();

    expect(document.querySelector('.xl-dialog')).toBe(null);

    rerender(
      <Dialog title='title' visible={true}>
        <div>body</div>
      </Dialog>,
    );

    await triggerTransitionEnd();
    expect(document.querySelector('.xl-dialog')).not.toBe(null);
    expect(document.querySelector<HTMLElement>('.xl-dialog')?.style.display).toBe('');

    rerender(
      <Dialog title='title' visible={false}>
        <div>body</div>
      </Dialog>,
    );

    await triggerTransitionEnd();

    expect(document.querySelector('.xl-dialog')).not.toBe(null);
    expect(document.querySelector<HTMLElement>('.xl-dialog')?.style.display).toBe('none');
  });

  it.todo('Test delay close');
});
