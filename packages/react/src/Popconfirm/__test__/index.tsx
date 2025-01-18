import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { Popconfirm } from '@xl-vision/react';

describe('Popconfirm', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('test trigger click', async () => {
    const { container } = render(
      <Popconfirm title='content'>
        <button id='btn'>button</button>
      </Popconfirm>,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('.xl-popconfirm__popup')).toBe(null);

    const btn = container.querySelector('#btn')!;

    const user = userEvent.setup({ delay: null });

    await user.click(btn);

    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('.xl-popconfirm__popup')).not.toBe(null);
  });
});
