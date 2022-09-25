import { act, render } from '@testing-library/react';
import Dialog from '..';

describe('Dialog', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  it('Test prop visible', () => {
    const { rerender } = render(
      <Dialog title='title'>
        <div>body</div>
      </Dialog>,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('.xl-dialog')).toBe(null);

    rerender(
      <Dialog title='title' visible={true}>
        <div>body</div>
      </Dialog>,
    );

    act(() => {
      jest.runAllTimers();
    });
    expect(document.querySelector('.xl-dialog')).not.toBe(null);
    expect(document.querySelector<HTMLElement>('.xl-dialog')?.style.display).toBe('');

    rerender(
      <Dialog title='title' visible={false}>
        <div>body</div>
      </Dialog>,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('.xl-dialog')).not.toBe(null);
    expect(document.querySelector<HTMLElement>('.xl-dialog')?.style.display).toBe('none');
  });

  it.todo('Test delay close');
});
