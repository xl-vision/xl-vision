import { act, render } from '@testing-library/react';
import DedicatedDialog from '..';

describe('Dialog', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  it('Test prop visible', () => {
    const { rerender } = render(
      <DedicatedDialog title='title'>
        <div>body</div>
      </DedicatedDialog>,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('.xl-dialog')).toBe(null);

    rerender(
      <DedicatedDialog title='title' visible={true}>
        <div>body</div>
      </DedicatedDialog>,
    );

    act(() => {
      jest.runAllTimers();
    });
    expect(document.querySelector('.xl-dialog')).not.toBe(null);
    expect(document.querySelector<HTMLElement>('.xl-dialog')?.style.display).toBe('');

    rerender(
      <DedicatedDialog title='title' visible={false}>
        <div>body</div>
      </DedicatedDialog>,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('.xl-dialog')).not.toBe(null);
    expect(document.querySelector<HTMLElement>('.xl-dialog')?.style.display).toBe('none');
  });

  it.todo('Test delay close');
});
