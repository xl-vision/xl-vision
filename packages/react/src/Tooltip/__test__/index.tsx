import { act, fireEvent, render } from '@testing-library/react';
import { Tooltip } from '@xl-vision/react';

describe('Tooltip', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('test trigger hover', () => {
    const { container } = render(
      <Tooltip content={<span id='content'>content</span>}>
        <button id='btn'>button</button>
      </Tooltip>,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('#content')).toBe(null);

    const btn = container.querySelector('#btn')!;

    fireEvent.mouseEnter(btn);

    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('#content')).not.toBe(null);
  });
});
