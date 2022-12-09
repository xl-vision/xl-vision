import { render } from '@testing-library/react';
import { triggerTransitionEnd } from 'test/utils';
import { Dialog } from '@xl-vision/react';

describe('Dialog', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  it('Test prop open', async () => {
    const { rerender } = render(
      <Dialog title='title'>
        <div>body</div>
      </Dialog>,
    );

    await triggerTransitionEnd();

    expect(document.querySelector('.xl-dialog')).toBe(null);

    rerender(
      <Dialog open={true} title='title'>
        <div>body</div>
      </Dialog>,
    );

    await triggerTransitionEnd();
    expect(document.querySelector('.xl-dialog')).not.toBe(null);
    expect(document.querySelector<HTMLElement>('.xl-dialog')?.style.display).toBe('');

    rerender(
      <Dialog open={false} title='title'>
        <div>body</div>
      </Dialog>,
    );

    await triggerTransitionEnd();

    expect(document.querySelector('.xl-dialog')).not.toBe(null);
    expect(document.querySelector<HTMLElement>('.xl-dialog')?.style.display).toBe('none');
  });

  it.todo('Test delay close');
});
