import { fireEvent, render } from '@testing-library/react';
import InputNumber from '../InputNumber';

describe('InputNumber', () => {
  it('Test onChange', () => {
    const fn = jest.fn();

    const wrapper = render(<InputNumber defaultValue={5} onChange={fn} />);

    expect(fn.mock.calls.length).toBe(0);

    const input = wrapper.container.querySelector('input')!;

    fireEvent.change(input, {
      target: {
        value: '6',
      },
    });

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(6);
    fn.mockClear();

    fireEvent.change(input, {
      target: {
        value: '6',
      },
    });

    expect(fn.mock.calls.length).toBe(0);
  });

  it('Test arrow', () => {
    const fn = jest.fn();

    const wrapper = render(<InputNumber defaultValue={5} onChange={fn} />);

    expect(fn.mock.calls.length).toBe(0);

    const up = wrapper.container.querySelector('.xl-input-number__control-up')!;

    fireEvent.click(up);

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(6);
    fn.mockClear();

    const down = wrapper.container.querySelector('.xl-input-number__control-down')!;

    fireEvent.click(down);

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(5);
  });

  it('Test keyboard', () => {
    const fn = jest.fn();

    const wrapper = render(<InputNumber defaultValue={5} onChange={fn} />);

    expect(fn.mock.calls.length).toBe(0);

    const input = wrapper.container.querySelector('input')!;

    fireEvent.keyDown(input, {
      key: 'ArrowUp',
    });

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(6);
    fn.mockClear();

    fireEvent.keyDown(input, {
      key: 'ArrowDown',
    });

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(5);
  });
});
