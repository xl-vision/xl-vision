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
});
