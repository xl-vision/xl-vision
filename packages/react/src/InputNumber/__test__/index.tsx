import { fireEvent, render } from '@testing-library/react';
import { CaretDownFilled, CaretUpFilled } from '@xl-vision/icons';
import { padEnd, padStart } from '@xl-vision/utils';
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
    fn.mockClear();

    wrapper.rerender(<InputNumber defaultValue={5} step={5} onChange={fn} />);

    fireEvent.keyDown(input, {
      key: 'ArrowUp',
    });

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(10);
    fn.mockClear();

    fireEvent.keyDown(input, {
      key: 'ArrowDown',
    });

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(5);
  });

  it('Test wheel', () => {
    const fn = jest.fn();

    const wrapper = render(<InputNumber defaultValue={5} wheel={true} onChange={fn} />);

    expect(fn.mock.calls.length).toBe(0);

    const input = wrapper.container.querySelector('input')!;

    fireEvent.wheel(input, {
      deltaY: -1,
    });

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(6);
    fn.mockClear();

    fireEvent.wheel(input, {
      deltaY: 1,
    });

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(5);
    fn.mockClear();

    fireEvent.wheel(input, {
      deltaY: 0,
    });

    expect(fn.mock.calls.length).toBe(0);

    wrapper.rerender(<InputNumber defaultValue={5} step={5} wheel={true} onChange={fn} />);

    fireEvent.wheel(input, {
      deltaY: -1,
    });

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(10);
    fn.mockClear();

    fireEvent.wheel(input, {
      deltaY: 1,
    });

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(5);
    fn.mockClear();

    fireEvent.wheel(input, {
      deltaY: 0,
    });

    expect(fn.mock.calls.length).toBe(0);
  });

  it('Test input invalid value', () => {
    const fn = jest.fn();

    const wrapper = render(<InputNumber defaultValue={5} onChange={fn} />);

    expect(fn.mock.calls.length).toBe(0);

    const input = wrapper.container.querySelector('input')!;

    fireEvent.change(input, {
      target: {
        value: '5.',
      },
    });

    expect(fn.mock.calls.length).toBe(0);

    fireEvent.change(input, {
      target: {
        value: '5.1',
      },
    });

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(5.1);
    fn.mockClear();

    fireEvent.change(input, {
      target: {
        value: '6a',
      },
    });

    expect(fn.mock.calls.length).toBe(0);
    expect(input.getAttribute('value')).toBe('6a');

    fireEvent.keyDown(input, {
      key: 'Enter',
    });

    expect(fn.mock.calls.length).toBe(0);
    expect(input.getAttribute('value')).toBe('5.1');

    fireEvent.change(input, {
      target: {
        value: '7.',
      },
    });

    expect(fn.mock.calls.length).toBe(0);
    expect(input.getAttribute('value')).toBe('7.');

    fireEvent.blur(input);

    expect(fn.mock.calls.length).toBe(0);
    expect(input.getAttribute('value')).toBe('5.1');
  });

  it('Test highPrecisionMode', () => {
    const fn = jest.fn();

    const value = padEnd('1', 20, '0') + '.' + padStart('1', 20, '0');

    const wrapper = render(
      <InputNumber defaultValue={value} highPrecisionMode={true} onChange={fn} />,
    );

    expect(fn.mock.calls.length).toBe(0);

    const input = wrapper.container.querySelector('input')!;

    fireEvent.keyDown(input, {
      key: 'ArrowUp',
    });

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(padEnd('1', 19, '0') + '1' + '.' + padStart('1', 20, '0'));
    fn.mockClear();

    fireEvent.keyDown(input, {
      key: 'ArrowDown',
    });

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(value);
  });

  it('Test precision', () => {
    const wrapper = render(<InputNumber precision={2} value={5} />);

    const input = wrapper.container.querySelector('input')!;

    expect(input.getAttribute('value')).toBe('5.00');

    wrapper.rerender(<InputNumber precision={2} value={5.11} />);
    expect(input.getAttribute('value')).toBe('5.11');

    wrapper.rerender(<InputNumber precision={2} value={5.111} />);
    expect(input.getAttribute('value')).toBe('5.11');
  });

  it('Test max and min', () => {
    const fn = jest.fn();

    const wrapper = render(<InputNumber defaultValue={8} max={10} onChange={fn} />);

    expect(fn.mock.calls.length).toBe(0);

    const input = wrapper.container.querySelector('input')!;

    fireEvent.keyDown(input, {
      key: 'ArrowUp',
    });

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(9);
    fn.mockClear();

    fireEvent.keyDown(input, {
      key: 'ArrowUp',
    });

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(10);
    fn.mockClear();

    fireEvent.keyDown(input, {
      key: 'ArrowUp',
    });

    expect(fn.mock.calls.length).toBe(0);

    wrapper.rerender(<InputNumber defaultValue={8} max={10} min={8} onChange={fn} />);

    expect(fn.mock.calls.length).toBe(0);

    fireEvent.keyDown(input, {
      key: 'ArrowDown',
    });

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(9);
    fn.mockClear();

    fireEvent.keyDown(input, {
      key: 'ArrowDown',
    });

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(8);
    fn.mockClear();

    fireEvent.keyDown(input, {
      key: 'ArrowDown',
    });

    expect(fn.mock.calls.length).toBe(0);
  });

  it('Test highPrecisionMode with max and min', () => {
    const value = padEnd('1', 20, '0') + '.' + padStart('1', 20, '0');
    const max = padEnd('1', 19, '0') + '2';
    const min = padEnd('1', 20, '0');

    const fn = jest.fn();

    const wrapper = render(
      <InputNumber
        defaultValue={value}
        highPrecisionMode={true}
        max={max}
        min={min}
        onChange={fn}
      />,
    );

    expect(fn.mock.calls.length).toBe(0);

    const input = wrapper.container.querySelector('input')!;

    fireEvent.keyDown(input, {
      key: 'ArrowUp',
    });

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(padEnd('1', 19, '0') + '1' + '.' + padStart('1', 20, '0'));
    fn.mockClear();

    fireEvent.keyDown(input, {
      key: 'ArrowUp',
    });

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(max);
    fn.mockClear();

    fireEvent.keyDown(input, {
      key: 'ArrowUp',
    });

    expect(fn.mock.calls.length).toBe(0);

    fireEvent.keyDown(input, {
      key: 'ArrowDown',
    });

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(padEnd('1', 19, '0') + '1');
    fn.mockClear();

    fireEvent.keyDown(input, {
      key: 'ArrowDown',
    });

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(padEnd('1', 19, '0') + '0');
    fn.mockClear();

    fireEvent.keyDown(input, {
      key: 'ArrowDown',
    });

    expect(fn.mock.calls.length).toBe(0);
  });

  it('Test parse and formatter', () => {
    const fn = jest.fn();

    const wrapper = render(
      <InputNumber
        defaultValue={1000}
        formatter={(value) => (value ? `$ ${value}`.replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',') : '')}
        parser={(value) => value.replaceAll(/\$\s?|(,*)/g, '')}
        onChange={fn}
      />,
    );

    expect(fn.mock.calls.length).toBe(0);

    const input = wrapper.container.querySelector('input')!;

    expect(input.getAttribute('value')).toBe('$ 1,000');

    fireEvent.keyDown(input, {
      key: 'ArrowUp',
    });

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(1001);
    expect(input.getAttribute('value')).toBe('$ 1,001');
  });

  it('Test defaultValue and value', () => {
    const fn = jest.fn();

    const wrapper = render(<InputNumber defaultValue={1} onChange={fn} />);

    expect(fn.mock.calls.length).toBe(0);

    const input = wrapper.container.querySelector('input')!;
    expect(input.getAttribute('value')).toBe('1');

    fireEvent.keyDown(input, {
      key: 'ArrowUp',
    });

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(2);
    fn.mockClear();
    expect(input.getAttribute('value')).toBe('2');

    wrapper.rerender(<InputNumber defaultValue={1} value={5} onChange={fn} />);

    expect(fn.mock.calls.length).toBe(0);
    expect(input.getAttribute('value')).toBe('5');

    fireEvent.keyDown(input, {
      key: 'ArrowUp',
    });
    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(6);
    expect(input.getAttribute('value')).toBe('5');
  });

  it('Test controls', () => {
    const wrapper = render(<InputNumber controls={true} />);

    expect(wrapper.container).toMatchSnapshot();

    wrapper.rerender(<InputNumber controls={false} />);

    expect(wrapper.container).toMatchSnapshot();

    wrapper.rerender(
      <InputNumber
        controls={{
          upIcon: <CaretUpFilled />,
          downIcon: <CaretDownFilled />,
        }}
      />,
    );
    expect(wrapper.container).toMatchSnapshot();
  });
});
