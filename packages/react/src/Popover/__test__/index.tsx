import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { Popover } from '@xl-vision/react';

describe('Popover', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('test trigger click', async () => {
    const { container } = render(
      <Popover content={<span id='content'>content</span>}>
        <button id='btn'>button</button>
      </Popover>,
    );
    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('#content')).toBe(null);

    const btn = container.querySelector('#btn')!;

    const user = userEvent.setup({ delay: null });

    await user.click(btn);

    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('#content')).not.toBe(null);
  });
});
