import { act, render } from '@testing-library/react';
import MethodDialog from '..';

describe('Dialog', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  it('Test prop visible', () => {
    const { rerender } = render(
      <MethodDialog title='title'>
        <div>body</div>
      </MethodDialog>,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('.xl-dialog')).toBe(null);

    rerender(
      <MethodDialog title='title' visible={true}>
        <div>body</div>
      </MethodDialog>,
    );

    act(() => {
      jest.runAllTimers();
    });
    expect(document.querySelector('.xl-dialog')).not.toBe(null);
    expect(document.querySelector<HTMLElement>('.xl-dialog')?.style.display).toBe('');

    rerender(
      <MethodDialog title='title' visible={false}>
        <div>body</div>
      </MethodDialog>,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('.xl-dialog')).not.toBe(null);
    expect(document.querySelector<HTMLElement>('.xl-dialog')?.style.display).toBe('none');
  });

  it.todo('Test delay close');
});
